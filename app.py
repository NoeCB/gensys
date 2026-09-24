"""
app.py
======

Dashboard del pediatra — RADIANT CDSS (Sistema 04).

Panel de alertas de soporte a la decisión clínica en Dermatitis Atópica
pediátrica, con captura de feedback del facultativo (bucle de mejora).

Ejecutar:
    streamlit run app.py

Requisitos previos:
    - Paso 1: python src/data/generate_synthetic_ehr.py   (genera el JSONL)
    - Paso 3: python src/models/train.py                  (genera el modelo)
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

import streamlit as st

# ---------------------------------------------------------------------------
# Rutas y bootstrap de imports
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent
INFERENCE_DIR = PROJECT_ROOT / "src" / "inference"
if str(INFERENCE_DIR) not in sys.path:
    sys.path.insert(0, str(INFERENCE_DIR))

RAW_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "synthetic_patients.jsonl"
FEEDBACK_PATH = PROJECT_ROOT / "data" / "feedback" / "clinical_feedback.jsonl"

st.set_page_config(
    page_title="RADIANT CDSS — Dermatitis Atópica Pediátrica",
    page_icon="🩺",
    layout="wide",
)


# ---------------------------------------------------------------------------
# Carga de dependencias del modelo (con manejo de errores)
# ---------------------------------------------------------------------------
@st.cache_resource(show_spinner="Cargando modelo de inferencia...")
def get_predict_fn():
    from predict import predict_patient_risk  # import diferido tras ajustar sys.path
    return predict_patient_risk


@st.cache_data(show_spinner="Cargando cohorte de pacientes...")
def load_patients() -> List[dict]:
    if not RAW_DATA_PATH.exists():
        return []
    with RAW_DATA_PATH.open("r", encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


# ---------------------------------------------------------------------------
# Persistencia de feedback
# ---------------------------------------------------------------------------
def save_feedback(patient_id: str, model_score: float, decision: str, notes: str) -> None:
    FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "patient_id": patient_id,
        "model_score": model_score,
        "doctor_decision": decision,  # APPROVED / REJECTED
        "doctor_notes": notes.strip(),
    }
    with FEEDBACK_PATH.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")


# ---------------------------------------------------------------------------
# Helpers de presentación
# ---------------------------------------------------------------------------
POTENCY_LABEL = {
    "Ninguno": "Ninguno",
    "Baja": "Baja (hidrocortisona)",
    "Media": "Media (aceponato de metilprednisolona)",
    "Alta/Muy Alta": "Alta/Muy Alta (mometasona, clobetasol)",
}


def risk_color(score: float) -> str:
    if score >= 0.5:
        return "#dc2626"  # rojo
    if score >= 0.25:
        return "#f59e0b"  # naranja
    return "#16a34a"      # verde


def new_case_defaults() -> dict:
    return {
        "patient_id": "NUEVO-CASO",
        "age_months": 60,
        "gender": "M",
        "corticosteroid_prescriptions_last_6m": 2,
        "max_corticosteroid_potency": "Media",
        "systemic_corticosteroid_cycles_last_year": 0,
        "emergency_visits_last_year": 0,
        "atopic_comorbidities": [],
        "clinical_note": "",
    }


# ---------------------------------------------------------------------------
# Cabecera
# ---------------------------------------------------------------------------
st.title("RADIANT — Soporte a la Decisión Clínica en Dermatitis Atópica Pediátrica")
st.warning(
    "Herramienta de ayuda al diagnóstico. La decisión clínica y derivación "
    "corresponden exclusivamente al facultativo.",
    icon="⚠️",
)

# Comprobación de artefactos
if not RAW_DATA_PATH.exists():
    st.error(
        f"No se encontró la cohorte en `{RAW_DATA_PATH}`. "
        "Ejecuta primero: `python src/data/generate_synthetic_ehr.py`"
    )
    st.stop()

try:
    predict_patient_risk = get_predict_fn()
except FileNotFoundError as exc:
    st.error(f"Modelo no disponible: {exc}")
    st.stop()
except Exception as exc:  # pragma: no cover - salvaguarda de arranque
    st.error(f"Error inicializando el servicio de inferencia: {exc}")
    st.stop()

patients = load_patients()


# ---------------------------------------------------------------------------
# Barra lateral: selección / nuevo caso
# ---------------------------------------------------------------------------
with st.sidebar:
    st.header("Selección de paciente")
    mode = st.radio(
        "Origen del caso",
        ["Paciente de la cohorte", "Nuevo caso de prueba"],
        index=0,
    )

    if mode == "Paciente de la cohorte":
        options = {p["patient_id"]: p for p in patients}
        selected_id = st.selectbox("Paciente", list(options.keys()))
        patient = options[selected_id]
    else:
        st.caption("Introduce los datos del nuevo paciente:")
        d = new_case_defaults()
        patient = {
            "patient_id": st.text_input("ID paciente", d["patient_id"]),
            "age_months": st.number_input("Edad (meses)", 6, 204, d["age_months"]),
            "gender": st.selectbox("Sexo", ["M", "F"], index=0),
            "corticosteroid_prescriptions_last_6m": st.number_input(
                "Prescripciones corticoide tópico (6m)", 0, 20, d["corticosteroid_prescriptions_last_6m"]
            ),
            "max_corticosteroid_potency": st.selectbox(
                "Máxima potencia corticoide",
                ["Ninguno", "Baja", "Media", "Alta/Muy Alta"],
                index=2,
            ),
            "systemic_corticosteroid_cycles_last_year": st.number_input(
                "Ciclos corticoide sistémico (12m)", 0, 12, d["systemic_corticosteroid_cycles_last_year"]
            ),
            "emergency_visits_last_year": st.number_input(
                "Visitas a urgencias (12m)", 0, 12, d["emergency_visits_last_year"]
            ),
            "atopic_comorbidities": st.multiselect(
                "Comorbilidades atópicas",
                ["asma", "rinitis alérgica", "alergia alimentaria", "conjuntivitis alérgica", "APLV"],
            ),
            "clinical_note": st.text_area("Nota clínica", height=160,
                                          placeholder="Describa el cuadro, evolución y respuesta al tratamiento..."),
        }


# ---------------------------------------------------------------------------
# Inferencia
# ---------------------------------------------------------------------------
try:
    result = predict_patient_risk(patient)
except Exception as exc:
    st.error(f"Error durante la inferencia: {exc}")
    st.stop()

score = result["risk_score"]
is_candidate = result["is_candidate"]


# ---------------------------------------------------------------------------
# Panel principal
# ---------------------------------------------------------------------------
col_info, col_score = st.columns([3, 2])

with col_info:
    st.subheader("Ficha del paciente")
    age_months = patient.get("age_months", 0)
    age_txt = f"{age_months} meses" if age_months < 24 else f"{age_months // 12} años"
    comorbidities = patient.get("atopic_comorbidities", []) or ["Sin comorbilidades registradas"]

    st.markdown(
        f"""
        - **ID:** {patient.get('patient_id', 'N/D')}
        - **Edad:** {age_txt}  |  **Sexo:** {patient.get('gender', 'N/D')}
        - **Máx. potencia corticoide:** {POTENCY_LABEL.get(patient.get('max_corticosteroid_potency', 'Ninguno'), 'N/D')}
        - **Prescripciones tópicas (6m):** {patient.get('corticosteroid_prescriptions_last_6m', 0)}
        - **Ciclos sistémicos (12m):** {patient.get('systemic_corticosteroid_cycles_last_year', 0)}
        - **Urgencias (12m):** {patient.get('emergency_visits_last_year', 0)}
        - **Comorbilidades:** {', '.join(comorbidities)}
        """
    )

    with st.expander("Nota clínica anonimizada", expanded=True):
        from anonymize_and_extract import anonymize  # reutiliza el anonimizador
        note = patient.get("clinical_note", "") or "(sin nota clínica)"
        st.text(anonymize(note))

with col_score:
    st.subheader("Score de Riesgo")
    color = risk_color(score)
    st.markdown(
        f"""
        <div style="text-align:center; padding:1.5rem; border-radius:16px;
                    background:{color}22; border:2px solid {color};">
            <div style="font-size:3rem; font-weight:800; color:{color};">
                {score * 100:.1f}%
            </div>
            <div style="font-size:1rem; color:{color}; font-weight:600;">
                {'CANDIDATO A DERIVACIÓN' if is_candidate else 'RIESGO BAJO'}
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.progress(min(max(score, 0.0), 1.0))


# ---------------------------------------------------------------------------
# Explicabilidad clínica
# ---------------------------------------------------------------------------
st.subheader("Explicabilidad clínica")
st.caption("Factores que más contribuyen a la alerta (SHAP), traducidos a lenguaje clínico.")

top_reasons: List[Dict] = result.get("top_reasons", [])
if not top_reasons:
    st.info("No hay factores con contribución positiva relevante al riesgo en este caso.")
else:
    cols = st.columns(len(top_reasons))
    for col, reason in zip(cols, top_reasons):
        with col:
            st.markdown(
                f"""
                <div style="padding:1rem; border-radius:12px; background:#1e293b0d;
                            border:1px solid #cbd5e1;">
                    <div style="font-weight:700; color:#0f172a;">{reason['clinical_explanation']}</div>
                    <div style="margin-top:.4rem; font-size:.85rem; color:#64748b;">
                        <code>{reason['feature']}</code> · impacto SHAP +{reason['shap_value']:.3f}
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )


# ---------------------------------------------------------------------------
# Bucle de feedback (Sistema 04)
# ---------------------------------------------------------------------------
st.divider()
st.subheader("Decisión clínica del facultativo")

with st.form("feedback_form", clear_on_submit=True):
    notes = st.text_area(
        "Motivo clínico / notas (opcional)",
        placeholder="Justificación de la decisión, matices clínicos, plan de seguimiento...",
        height=100,
    )
    c1, c2 = st.columns(2)
    with c1:
        approve = st.form_submit_button("✅ Validar derivación a especialista/biológico",
                                        use_container_width=True)
    with c2:
        reject = st.form_submit_button("❌ Descartar alerta (Falso positivo)",
                                       use_container_width=True)

    if approve or reject:
        decision = "APPROVED" if approve else "REJECTED"
        save_feedback(
            patient_id=result["patient_id"],
            model_score=score,
            decision=decision,
            notes=notes,
        )
        st.toast(
            f"Feedback registrado: {decision} para {result['patient_id']}",
            icon="✅" if approve else "🗑️",
        )
        st.success(f"Decisión **{decision}** guardada en `{FEEDBACK_PATH}`.")


# ---------------------------------------------------------------------------
# Pie
# ---------------------------------------------------------------------------
st.divider()
st.caption(
    "RADIANT CDSS · Modelo XGBoost + explicabilidad SHAP · "
    "El feedback registrado alimenta el ciclo de mejora continua del modelo."
)
