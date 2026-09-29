"""
predict.py
==========

Servicio de inferencia desacoplado de RADIANT CDSS (Sistema 03).

Expone `predict_patient_risk(patient_dict)` que, a partir de los datos crudos de
un paciente (campos estructurados + nota clínica), reutiliza la extracción de
features del Paso 2, ordena las columnas según models/feature_names.json, carga
el modelo XGBoost del Paso 3 y devuelve:

    {
        "patient_id": str,
        "risk_score": float,          # 0.0 - 1.0
        "is_candidate": bool,         # risk_score >= UMBRAL (0.5)
        "top_reasons": [              # 3 features de mayor impacto positivo
            {"feature": str, "shap_value": float, "clinical_explanation": str},
            ...
        ]
    }

Diseñado para consumo directo (serverless/API) y para el dashboard Streamlit.

Uso como script (caso de prueba):
    python src/inference/predict.py
"""

from __future__ import annotations

import json
import logging
import sys
from pathlib import Path
from typing import Dict, List

import numpy as np
import pandas as pd
import shap
import xgboost as xgb

# ---------------------------------------------------------------------------
# Reutilización de la lógica de features del Paso 2 (import robusto)
# ---------------------------------------------------------------------------
# Permite importar `anonymize_and_extract` tanto si se ejecuta como módulo
# (`python -m ...`) como si se lanza el archivo directamente.
_FEATURES_DIR = (Path(__file__).resolve().parent.parent / "features")
if str(_FEATURES_DIR) not in sys.path:
    sys.path.insert(0, str(_FEATURES_DIR))

from anonymize_and_extract import (  # noqa: E402
    FEATURE_COLUMNS,
    POTENCY_ORDINAL,
    anonymize,
    extract_text_flags,
)

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------
_PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = _PROJECT_ROOT / "models" / "xgb_biologic_detector.json"
FEATURE_NAMES_PATH = _PROJECT_ROOT / "models" / "feature_names.json"

RISK_THRESHOLD = 0.5

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("predict")


# ---------------------------------------------------------------------------
# Traducción de features a lenguaje clínico
# ---------------------------------------------------------------------------
CLINICAL_EXPLANATIONS: Dict[str, str] = {
    "age_months": "Edad del paciente (meses).",
    "corticosteroid_prescriptions_last_6m": "Elevado número de prescripciones de corticoide tópico en los últimos 6 meses.",
    "systemic_corticosteroid_cycles_last_year": "Uso de ciclos de corticoide sistémico oral (rescate) en el último año.",
    "emergency_visits_last_year": "Visitas a urgencias por brote agudo o sobreinfección en el último año.",
    "potency_encoded": "Escalado a corticoide tópico de alta potencia.",
    "num_atopic_comorbidities": "Comorbilidades atópicas asociadas (marcha atópica: asma, rinitis, alergia).",
    "feat_prurito_intenso": "Prurito intenso/intratable con rascado continuo o excoriaciones.",
    "feat_trastorno_sueno": "Alteración grave del sueño/descanso del menor y la familia.",
    "feat_absentismo_escolar": "Absentismo escolar por mal control de la enfermedad.",
    "feat_fallo_corticoide": "Refractariedad o recaída rápida pese a corticoterapia tópica.",
    "feat_zonas_criticas": "Afectación de zonas críticas (cara, párpados, cuello o pliegues).",
}


def _explain(feature: str) -> str:
    return CLINICAL_EXPLANATIONS.get(feature, feature)


# ---------------------------------------------------------------------------
# Carga perezosa de artefactos (cache en proceso)
# ---------------------------------------------------------------------------
_MODEL: xgb.XGBClassifier | None = None
_EXPLAINER: shap.TreeExplainer | None = None
_EXPECTED_COLUMNS: List[str] | None = None


def _load_artifacts():
    """Carga modelo, explainer y columnas esperadas (una sola vez por proceso)."""
    global _MODEL, _EXPLAINER, _EXPECTED_COLUMNS

    if _MODEL is not None and _EXPLAINER is not None and _EXPECTED_COLUMNS is not None:
        return _MODEL, _EXPLAINER, _EXPECTED_COLUMNS

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"No se encontró el modelo en {MODEL_PATH}. "
            "Ejecuta primero el Paso 3: python src/models/train.py"
        )
    if not FEATURE_NAMES_PATH.exists():
        raise FileNotFoundError(
            f"No se encontró {FEATURE_NAMES_PATH}. Ejecuta el Paso 3: python src/models/train.py"
        )

    model = xgb.XGBClassifier()
    model.load_model(str(MODEL_PATH))
    expected_columns = json.loads(FEATURE_NAMES_PATH.read_text(encoding="utf-8"))
    explainer = shap.TreeExplainer(model)

    _MODEL, _EXPLAINER, _EXPECTED_COLUMNS = model, explainer, expected_columns
    logger.info("Artefactos de modelo cargados (%d features esperadas).", len(expected_columns))
    return model, explainer, expected_columns


# ---------------------------------------------------------------------------
# Extracción de features a partir del paciente crudo
# ---------------------------------------------------------------------------
def _build_feature_row(patient_dict: dict) -> pd.DataFrame:
    """Construye una fila de features alineada con FEATURE_COLUMNS."""
    note = patient_dict.get("clinical_note", "") or ""
    flags = extract_text_flags(note)

    potency = patient_dict.get("max_corticosteroid_potency", "Ninguno")
    if potency not in POTENCY_ORDINAL:
        logger.warning("Potencia desconocida '%s'; se asigna 0 (Ninguno).", potency)

    row = {
        "age_months": int(patient_dict.get("age_months", 0)),
        "corticosteroid_prescriptions_last_6m": int(patient_dict.get("corticosteroid_prescriptions_last_6m", 0)),
        "systemic_corticosteroid_cycles_last_year": int(patient_dict.get("systemic_corticosteroid_cycles_last_year", 0)),
        "emergency_visits_last_year": int(patient_dict.get("emergency_visits_last_year", 0)),
        "potency_encoded": POTENCY_ORDINAL.get(potency, 0),
        "num_atopic_comorbidities": len(patient_dict.get("atopic_comorbidities", []) or []),
        **flags,
    }
    return pd.DataFrame([row])[FEATURE_COLUMNS]


# ---------------------------------------------------------------------------
# API principal
# ---------------------------------------------------------------------------
def predict_patient_risk(patient_dict: dict) -> dict:
    """
    Calcula el riesgo de candidatura a terapia biológica de un paciente.

    Parameters
    ----------
    patient_dict : dict
        Datos crudos del paciente (campos estructurados + `clinical_note`).

    Returns
    -------
    dict
        patient_id, risk_score, is_candidate, top_reasons.
    """
    model, explainer, expected_columns = _load_artifacts()

    features = _build_feature_row(patient_dict)
    # Reordena estrictamente según feature_names.json (contrato de inferencia)
    features = features.reindex(columns=expected_columns, fill_value=0)

    risk_score = float(model.predict_proba(features)[0, 1])
    is_candidate = bool(risk_score >= RISK_THRESHOLD)

    # --- Explicabilidad local (top-3 contribuciones positivas) ---
    shap_values = np.asarray(explainer.shap_values(features))[0]
    contributions = sorted(
        (
            {"feature": col, "shap_value": float(sv), "clinical_explanation": _explain(col)}
            for col, sv in zip(expected_columns, shap_values)
            if sv > 0
        ),
        key=lambda c: c["shap_value"],
        reverse=True,
    )
    top_reasons = contributions[:3]

    return {
        "patient_id": patient_dict.get("patient_id", "UNKNOWN"),
        "risk_score": round(risk_score, 4),
        "is_candidate": is_candidate,
        "top_reasons": top_reasons,
    }


# ---------------------------------------------------------------------------
# Caso de prueba
# ---------------------------------------------------------------------------
def _demo() -> None:
    sample_patient = {
        "patient_id": "PED-TEST-001",
        "age_months": 96,
        "gender": "F",
        "corticosteroid_prescriptions_last_6m": 6,
        "max_corticosteroid_potency": "Alta/Muy Alta",
        "systemic_corticosteroid_cycles_last_year": 2,
        "emergency_visits_last_year": 3,
        "atopic_comorbidities": ["asma", "rinitis alérgica", "alergia alimentaria"],
        "clinical_note": (
            "Acude por brote severo de dermatitis atópica con eccema en cara y pliegues. "
            "Refiere prurito intenso e intratable con excoriaciones por rascado continuo. "
            "Alteración grave del sueño e insomnio familiar. Se constata absentismo escolar. "
            "No hay respuesta tras varias semanas de corticoterapia tópica de alta potencia, "
            "con recaída al espaciar aplicaciones."
        ),
    }
    result = predict_patient_risk(sample_patient)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    _demo()
