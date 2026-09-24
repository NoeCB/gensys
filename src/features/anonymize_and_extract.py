"""
anonymize_and_extract.py
========================

Pipeline de preprocesamiento y extracción de features para RADIANT CDSS (Paso 2).

Transforma:
    data/raw/synthetic_patients.jsonl   (entrada, generada en el Paso 1)
en un dataset tabular limpio y listo para entrenar:
    data/processed/features_patients.parquet   (salida principal, pyarrow + snappy)
    data/processed/features_patients.csv        (copia para inspección manual)

Responsabilidades:
    1. Anonimización de PII en la nota clínica (regex clínica + spaCy NER opcional):
       nombres de personas, hospitales, fechas y doctores -> <PACIENTE> <HOSPITAL>
       <FECHA> <MEDICO>. Se conserva en `clinical_note_anonymized` para auditoría.
    2. Feature engineering clínico:
       - Variables estructuradas (edad, corticoides, urgencias, potencia ordinal...).
       - Banderas booleanas derivadas del texto (prurito, sueño, absentismo...).
    3. Target: `target_candidate_biologic`.
    4. Persistencia + logging + aserciones de consistencia.

Estrategia de anonimización:
    Ligera y sin coste. La regex es la vía principal (determinista y auditable).
    spaCy (modelo es_core_news_sm) actúa como refuerzo de NER si está instalado;
    si no lo está, el pipeline continúa sin fallar (fallback limpio).

Uso:
    python src/features/anonymize_and_extract.py
"""

from __future__ import annotations

import json
import logging
import re
import time
from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------
INPUT_PATH = Path("data/raw/synthetic_patients.jsonl")
OUTPUT_PARQUET = Path("data/processed/features_patients.parquet")
OUTPUT_CSV = Path("data/processed/features_patients.csv")

POTENCY_ORDINAL: Dict[str, int] = {
    "Ninguno": 0,
    "Baja": 1,
    "Media": 2,
    "Alta/Muy Alta": 3,
}

# Columnas de features que NO pueden contener NaN (aserción de calidad)
FEATURE_COLUMNS: List[str] = [
    "age_months",
    "corticosteroid_prescriptions_last_6m",
    "systemic_corticosteroid_cycles_last_year",
    "emergency_visits_last_year",
    "potency_encoded",
    "num_atopic_comorbidities",
    "feat_prurito_intenso",
    "feat_trastorno_sueno",
    "feat_absentismo_escolar",
    "feat_fallo_corticoide",
    "feat_zonas_criticas",
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("features_pipeline")


# ---------------------------------------------------------------------------
# spaCy opcional (refuerzo de NER, con fallback limpio)
# ---------------------------------------------------------------------------
def _load_spacy_model():
    """Carga es_core_news_sm si está disponible. Devuelve None si no lo está."""
    try:
        import spacy  # noqa: WPS433 (import local intencionado)
    except ImportError:
        logger.warning("spaCy no instalado; se usa solo anonimización por regex.")
        return None
    try:
        nlp = spacy.load("es_core_news_sm", disable=["parser", "lemmatizer", "tagger"])
        logger.info("Modelo spaCy 'es_core_news_sm' cargado (refuerzo NER activo).")
        return nlp
    except OSError:
        logger.warning(
            "Modelo spaCy 'es_core_news_sm' no encontrado; se usa solo regex. "
            "Para activar NER: python -m spacy download es_core_news_sm"
        )
        return None


# ---------------------------------------------------------------------------
# Anonimización de PII
# ---------------------------------------------------------------------------
# Orden importa: primero patrones específicos (hospital, médico, fecha), luego
# nombres de paciente/tutor. Todo case-insensitive salvo cuando es necesario.

# Fecha dd/mm/aaaa
_RE_FECHA = re.compile(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b")

# Hospitales: cabecera entre corchetes [Hospital ...] y menciones sueltas
_RE_HOSPITAL_BRACKET = re.compile(r"\[[^\]]*?(?:Hospital|Clínico|Infantil)[^\]]*?\]", re.IGNORECASE)
_RE_HOSPITAL_INLINE = re.compile(
    r"\bHospital(?:\s+(?:Universitario|Infantil|Clínico))?\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]*"
    r"(?:\s+(?:de\s+)?[A-ZÁÉÍÓÚÑ0-9][\wÁÉÍÓÚÑáéíóúñ]*){0,3}",
)

# Médico: "Dr./Dra. Nombre Apellido"
_RE_MEDICO = re.compile(
    r"\b(?:Dr|Dra)\.?\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+){0,2}"
)

# Paciente: "Paciente: Nombre Apellido Apellido,"
_RE_PACIENTE = re.compile(
    r"(Paciente:\s*)([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+){1,3})"
)

# Tutor: "por <relacion> (Nombre Apellido Apellido)"
_RE_TUTOR = re.compile(
    r"(\()([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+){1,3})(\))"
)


def anonymize_regex(text: str) -> str:
    """Anonimización determinista basada en regex clínica."""
    out = text
    # Hospitales (primero el bracketed de cabecera, luego inline)
    out = _RE_HOSPITAL_BRACKET.sub("[<HOSPITAL>]", out)
    out = _RE_HOSPITAL_INLINE.sub("<HOSPITAL>", out)
    # Médicos
    out = _RE_MEDICO.sub("<MEDICO>", out)
    # Paciente y tutor (mantienen delimitadores)
    out = _RE_PACIENTE.sub(r"\1<PACIENTE>", out)
    out = _RE_TUTOR.sub(r"\1<PACIENTE>\3", out)
    # Fechas
    out = _RE_FECHA.sub("<FECHA>", out)
    return out


def anonymize_spacy(text: str, nlp) -> str:
    """Refuerzo NER: sustituye entidades PER/LOC/ORG residuales por tokens."""
    if nlp is None:
        return text
    doc = nlp(text)
    # Sustituye de derecha a izquierda para preservar offsets
    spans = sorted(doc.ents, key=lambda e: e.start_char, reverse=True)
    chars = list(text)
    for ent in spans:
        token: Optional[str] = None
        if ent.label_ == "PER":
            token = "<PACIENTE>"
        elif ent.label_ in {"ORG", "LOC"} and re.search(r"hospital", ent.text, re.IGNORECASE):
            token = "<HOSPITAL>"
        if token is not None:
            chars[ent.start_char:ent.end_char] = list(token)
    return "".join(chars)


def anonymize(text: str, nlp=None) -> str:
    """Pipeline de anonimización: regex (principal) + spaCy (refuerzo opcional)."""
    return anonymize_spacy(anonymize_regex(text), nlp)


# ---------------------------------------------------------------------------
# Banderas clínicas derivadas del texto
# ---------------------------------------------------------------------------
_FLAG_PATTERNS: Dict[str, re.Pattern] = {
    "feat_prurito_intenso": re.compile(
        r"prurito\s+(?:intenso|incoercible|severo)|rascado\s+continuo|excoriaciones", re.IGNORECASE
    ),
    "feat_trastorno_sueno": re.compile(
        r"insomnio|despertar(?:es)?\s+nocturno|afectaci[oó]n\s+del\s+(?:sue[ñn]o|descanso)"
        r"|apenas\s+descansa|no\s+descansa", re.IGNORECASE
    ),
    "feat_absentismo_escolar": re.compile(
        r"absentismo\s+escolar|falta(?:s)?\s+(?:al|a\s+la)\s+(?:colegio|escuela|guarder[ií]a)"
        r"|no\s+acude\s+(?:al|a\s+la)\s+(?:colegio|escuela|guarder[ií]a)", re.IGNORECASE
    ),
    "feat_fallo_corticoide": re.compile(
        r"no\s+hay\s+respuesta|sin\s+respuesta|refractari|reca[ií]da"
        r"|falta\s+de\s+respuesta|al\s+espaciar\s+aplicaciones", re.IGNORECASE
    ),
    "feat_zonas_criticas": re.compile(
        r"\bcara\b|p[aá]rpados|\bcuello\b|pliegues|flexural|antecubital|popl[ií]te", re.IGNORECASE
    ),
}


def extract_text_flags(note: str) -> Dict[str, int]:
    """Deriva banderas booleanas (0/1) a partir de la nota clínica."""
    return {flag: int(bool(pattern.search(note))) for flag, pattern in _FLAG_PATTERNS.items()}


# ---------------------------------------------------------------------------
# Carga
# ---------------------------------------------------------------------------
def load_raw(path: Path) -> List[dict]:
    if not path.exists():
        raise FileNotFoundError(
            f"No existe {path}. Ejecuta primero el Paso 1: "
            "python src/data/generate_synthetic_ehr.py"
        )
    with path.open("r", encoding="utf-8") as fh:
        records = [json.loads(line) for line in fh if line.strip()]
    return records


# ---------------------------------------------------------------------------
# Construcción del dataset de features
# ---------------------------------------------------------------------------
def build_features(records: List[dict], nlp=None) -> pd.DataFrame:
    rows: List[dict] = []
    for rec in records:
        note = rec.get("clinical_note", "")
        note_anon = anonymize(note, nlp)
        flags = extract_text_flags(note)  # sobre el texto original (más señal léxica)

        row = {
            "patient_id": rec["patient_id"],
            # --- estructuradas ---
            "age_months": int(rec["age_months"]),
            "corticosteroid_prescriptions_last_6m": int(rec["corticosteroid_prescriptions_last_6m"]),
            "systemic_corticosteroid_cycles_last_year": int(rec["systemic_corticosteroid_cycles_last_year"]),
            "emergency_visits_last_year": int(rec["emergency_visits_last_year"]),
            "potency_encoded": POTENCY_ORDINAL[rec["max_corticosteroid_potency"]],
            "num_atopic_comorbidities": len(rec.get("atopic_comorbidities", [])),
            # --- banderas de texto ---
            **flags,
            # --- target + trazabilidad ---
            "target_candidate_biologic": int(rec["target_candidate_biologic"]),
            "clinical_note_anonymized": note_anon,
        }
        rows.append(row)

    df = pd.DataFrame(rows)
    # Orden de columnas: id, features, target, nota anonimizada
    ordered = (
        ["patient_id"]
        + FEATURE_COLUMNS
        + ["target_candidate_biologic", "clinical_note_anonymized"]
    )
    return df[ordered]


# ---------------------------------------------------------------------------
# Aserciones de consistencia
# ---------------------------------------------------------------------------
def validate(df: pd.DataFrame, n_input: int) -> None:
    assert len(df) == n_input, (
        f"Recuento no coincide: entrada={n_input}, salida={len(df)}"
    )
    null_counts = df[FEATURE_COLUMNS].isna().sum()
    total_nulls = int(null_counts.sum())
    assert total_nulls == 0, f"Se detectaron NaN en features:\n{null_counts[null_counts > 0]}"

    # Trazabilidad: la nota anonimizada no debe conservar patrones PII evidentes
    residual_dates = df["clinical_note_anonymized"].str.contains(r"\d{1,2}/\d{1,2}/\d{2,4}", regex=True).sum()
    residual_doctors = df["clinical_note_anonymized"].str.contains(r"\bDr\.?\b|\bDra\.?\b", regex=True).sum()
    assert residual_dates == 0, f"Quedan {residual_dates} fechas sin anonimizar"
    assert residual_doctors == 0, f"Quedan {residual_doctors} referencias a médico sin anonimizar"

    logger.info("Aserciones OK: 0 NaN en features, 0 PII residual (fechas/médicos).")


# ---------------------------------------------------------------------------
# Persistencia
# ---------------------------------------------------------------------------
def save_outputs(df: pd.DataFrame) -> None:
    OUTPUT_PARQUET.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(OUTPUT_PARQUET, engine="pyarrow", compression="snappy", index=False)
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")


# ---------------------------------------------------------------------------
# Orquestación
# ---------------------------------------------------------------------------
def run() -> pd.DataFrame:
    t0 = time.perf_counter()
    logger.info("Cargando datos crudos desde %s ...", INPUT_PATH)
    records = load_raw(INPUT_PATH)
    n_input = len(records)
    logger.info("Registros cargados: %d", n_input)

    nlp = _load_spacy_model()

    df = build_features(records, nlp)
    validate(df, n_input)
    save_outputs(df)

    elapsed = time.perf_counter() - t0
    positives = int(df["target_candidate_biologic"].sum())
    logger.info("Pacientes procesados: %d", len(df))
    logger.info("Dimensiones matriz final: %d filas x %d columnas", df.shape[0], df.shape[1])
    logger.info("Positivos (target=1): %d (%.1f%%)", positives, 100 * positives / len(df))
    logger.info("Guardado -> %s (parquet) y %s (csv)", OUTPUT_PARQUET, OUTPUT_CSV)
    logger.info("Tiempo de procesamiento: %.3f s", elapsed)
    return df


def main() -> None:
    run()


if __name__ == "__main__":
    main()
