"""
generate_synthetic_ehr.py
==========================

Generador de EHR sintéticos para RADIANT CDSS.

Crea un dataset de 100 pacientes pediátricos ficticios con Dermatitis Atópica (DA)
para entrenar/validar un sistema de soporte a la decisión clínica (derivación a
terapia biológica, p.ej. dupilumab).

Características MLOps:
    * Reproducibilidad total con seed=42.
    * Esquema validado con Pydantic.
    * Distribución balanceada realista (60% leve / 25% moderado / 15% severo).
    * Logging del recuento y la proporción de positivos.
    * PII sintética embebida en la nota clínica para probar la futura capa de
      desidentificación/anonimización.

Salida:
    data/raw/synthetic_patients.jsonl   (JSON Lines, 1 paciente por línea)

Uso:
    python src/data/generate_synthetic_ehr.py
"""

from __future__ import annotations

import json
import logging
import random
from datetime import date, timedelta
from enum import Enum
from pathlib import Path
from typing import List, Optional

try:
    from pydantic import BaseModel, Field, field_validator
    _PYDANTIC_V2 = True
except ImportError as exc:  # pragma: no cover - dependencia obligatoria
    raise SystemExit(
        "Este script requiere 'pydantic'. Instálalo con: pip install pydantic"
    ) from exc


# ---------------------------------------------------------------------------
# Configuración global / Reproducibilidad
# ---------------------------------------------------------------------------
SEED = 42
N_PATIENTS = 100

# Distribución objetivo de severidad
DIST_MILD = 0.60      # leves/controlados
DIST_MODERATE = 0.25  # moderados
DIST_SEVERE = 0.15    # severos refractarios (candidatos claros a biológico)

OUTPUT_PATH = Path("data/raw/synthetic_patients.jsonl")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("synthetic_ehr")


# ---------------------------------------------------------------------------
# Enumeraciones y esquema (Pydantic)
# ---------------------------------------------------------------------------
class Severity(str, Enum):
    MILD = "leve"
    MODERATE = "moderado"
    SEVERE = "severo"


class Potency(str, Enum):
    NONE = "Ninguno"
    LOW = "Baja"           # hidrocortisona
    MEDIUM = "Media"       # aceponato de metilprednisolona
    HIGH = "Alta/Muy Alta"  # mometasona, clobetasol


class Gender(str, Enum):
    MALE = "M"
    FEMALE = "F"


class SyntheticPatient(BaseModel):
    """Esquema de un paciente sintético (registro EHR estructurado + nota libre)."""

    patient_id: str = Field(..., pattern=r"^PED-\d{3}$")
    age_months: int = Field(..., ge=6, le=204)
    gender: Gender
    corticosteroid_prescriptions_last_6m: int = Field(..., ge=0)
    max_corticosteroid_potency: Potency
    systemic_corticosteroid_cycles_last_year: int = Field(..., ge=0)
    emergency_visits_last_year: int = Field(..., ge=0)
    atopic_comorbidities: List[str] = Field(default_factory=list)
    target_candidate_biologic: int = Field(..., ge=0, le=1)
    # Metadatos de apoyo (no PII estructurada)
    severity_label: Severity
    clinical_note: str

    @field_validator("clinical_note")
    @classmethod
    def _note_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("clinical_note no puede estar vacía")
        return v


# ---------------------------------------------------------------------------
# Vocabulario sintético para PII y contenido clínico
# ---------------------------------------------------------------------------
FIRST_NAMES_M = ["Lucas", "Mateo", "Leo", "Hugo", "Martín", "Daniel", "Pablo", "Álvaro", "Marcos", "Diego"]
FIRST_NAMES_F = ["Sofía", "Emma", "Lucía", "Martina", "Valeria", "Julia", "Carla", "Noa", "Alba", "Daniela"]
LAST_NAMES = ["Gómez", "Martín", "Torres", "Ruiz", "Navarro", "Sánchez", "Díaz", "Romero", "Molina", "Ortega",
              "Castro", "Ramírez", "Vega", "Herrera", "Cabrera"]

GUARDIAN_RELATIONS = ["la madre", "el padre", "la tutora legal", "el abuelo", "la abuela"]

HOSPITALS_MADRID = [
    "Hospital Universitario La Paz",
    "Hospital Infantil Niño Jesús",
    "Hospital Universitario Gregorio Marañón",
    "Hospital Universitario 12 de Octubre",
    "Hospital Clínico San Carlos",
    "Hospital Universitario Ramón y Cajal",
]

PEDIATRICIANS = [
    "Dr. Carlos Mendoza", "Dra. Isabel Benítez", "Dr. Javier Alonso",
    "Dra. Marta Rincón", "Dr. Andrés Salas", "Dra. Elena Prado",
]

ALL_COMORBIDITIES = ["asma", "rinitis alérgica", "alergia alimentaria", "conjuntivitis alérgica", "APLV"]

CRITICAL_LOCATIONS = ["cara", "párpados", "pliegues antecubitales", "huecos poplíteos", "cuello", "manos"]
MILD_LOCATIONS = ["dorso de tobillos", "cara anterior de antebrazos", "hueco poplíteo", "muñecas"]


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def _random_consultation_date(rng: random.Random) -> date:
    """Fecha de consulta aleatoria dentro de los últimos 180 días."""
    today = date(2026, 9, 24)
    return today - timedelta(days=rng.randint(0, 180))


def _full_name(rng: random.Random, gender: Gender) -> str:
    first = rng.choice(FIRST_NAMES_M if gender == Gender.MALE else FIRST_NAMES_F)
    return f"{first} {rng.choice(LAST_NAMES)} {rng.choice(LAST_NAMES)}"


def _age_str(age_months: int) -> str:
    if age_months < 24:
        return f"{age_months} meses"
    years = age_months // 12
    return f"{years} años"


# ---------------------------------------------------------------------------
# Generación de nota clínica con PII sintética
# ---------------------------------------------------------------------------
def build_clinical_note(rng: random.Random, *, severity: Severity, gender: Gender,
                        age_months: int, comorbidities: List[str]) -> str:
    patient_name = _full_name(rng, gender)
    guardian = rng.choice(GUARDIAN_RELATIONS)
    guardian_name = _full_name(rng, rng.choice([Gender.MALE, Gender.FEMALE]))
    hospital = rng.choice(HOSPITALS_MADRID)
    pediatrician = rng.choice(PEDIATRICIANS)
    consult_date = _random_consultation_date(rng).strftime("%d/%m/%Y")
    age_txt = _age_str(age_months)
    como_txt = ", ".join(comorbidities) if comorbidities else "sin comorbilidades atópicas relevantes"

    header = (
        f"[{hospital}] Consulta de {consult_date} — {pediatrician}. "
        f"Paciente: {patient_name}, {age_txt}. Acompañado por {guardian} ({guardian_name}). "
        f"Antecedentes atópicos: {como_txt}. "
    )

    if severity == Severity.SEVERE:
        loc = ", ".join(rng.sample(CRITICAL_LOCATIONS, k=rng.randint(2, 3)))
        body = (
            f"Acude por brote severo de dermatitis atópica con eccema exudativo y liquenificado en {loc}. "
            f"{guardian.capitalize()} refiere prurito intenso e intratable con excoriaciones por rascado continuo. "
            "Alteración grave del sueño: el menor apenas descansa y la familia acumula insomnio y agotamiento. "
            "Se constata absentismo escolar por el mal control. "
            "No hay respuesta tras varias semanas de corticoterapia tópica de alta potencia, con recaída al espaciar aplicaciones. "
            "Afectación de zonas críticas (cara/párpados/pliegues). Sospecha de DA severa refractaria: se valora derivación "
            "a Dermatología Pediátrica para inicio de terapia biológica (dupilumab)."
        )
    elif severity == Severity.MODERATE:
        loc = ", ".join(rng.sample(MILD_LOCATIONS + ["cuello"], k=rng.randint(1, 2)))
        body = (
            f"Revisión por brotes moderados de dermatitis atópica en {loc}. "
            "Prurito moderado que interfiere puntualmente al conciliar el sueño, sin despertares frecuentes. "
            "Control parcial con tandas cortas de corticoide tópico de potencia media y emolientes. "
            "Se mantiene tratamiento tópico y se cita para reevaluación."
        )
    else:  # MILD
        loc = rng.choice(MILD_LOCATIONS)
        body = (
            f"Revisión de dermatitis atópica leve con leve xerosis y eritema en {loc}. "
            "Brotes controlados con emolientes y tandas cortas de hidrocortisona, sin afectación del descanso nocturno. "
            "Buen estado general. Se refuerza hidratación diaria y manejo en Atención Primaria."
        )

    return header + body


# ---------------------------------------------------------------------------
# Generación de paciente por severidad
# ---------------------------------------------------------------------------
def generate_patient(rng: random.Random, index: int, severity: Severity) -> SyntheticPatient:
    gender = rng.choice([Gender.MALE, Gender.FEMALE])
    age_months = rng.randint(6, 204)

    if severity == Severity.SEVERE:
        n_como = rng.randint(2, 4)
        comorbidities = rng.sample(ALL_COMORBIDITIES, k=n_como)
        cortico_6m = rng.randint(4, 8)
        potency = rng.choice([Potency.HIGH, Potency.HIGH, Potency.MEDIUM])
        systemic_cycles = rng.randint(1, 3)
        er_visits = rng.randint(1, 4)
        candidate = 1
    elif severity == Severity.MODERATE:
        n_como = rng.randint(0, 2)
        comorbidities = rng.sample(ALL_COMORBIDITIES, k=n_como)
        cortico_6m = rng.randint(2, 4)
        potency = rng.choice([Potency.MEDIUM, Potency.LOW, Potency.HIGH])
        systemic_cycles = rng.choice([0, 0, 1])
        er_visits = rng.randint(0, 1)
        candidate = 0
    else:  # MILD
        n_como = rng.randint(0, 1)
        comorbidities = rng.sample(ALL_COMORBIDITIES, k=n_como)
        cortico_6m = rng.randint(0, 2)
        potency = rng.choice([Potency.NONE, Potency.LOW, Potency.LOW])
        systemic_cycles = 0
        er_visits = 0
        candidate = 0

    note = build_clinical_note(
        rng,
        severity=severity,
        gender=gender,
        age_months=age_months,
        comorbidities=comorbidities,
    )

    return SyntheticPatient(
        patient_id=f"PED-{index:03d}",
        age_months=age_months,
        gender=gender,
        corticosteroid_prescriptions_last_6m=cortico_6m,
        max_corticosteroid_potency=potency,
        systemic_corticosteroid_cycles_last_year=systemic_cycles,
        emergency_visits_last_year=er_visits,
        atopic_comorbidities=comorbidities,
        target_candidate_biologic=candidate,
        severity_label=severity,
        clinical_note=note,
    )


def build_severity_plan(n: int) -> List[Severity]:
    """Reparte n pacientes según la distribución objetivo (determinista)."""
    n_severe = round(n * DIST_SEVERE)
    n_moderate = round(n * DIST_MODERATE)
    n_mild = n - n_severe - n_moderate  # el resto para que sume exactamente n
    plan = (
        [Severity.MILD] * n_mild
        + [Severity.MODERATE] * n_moderate
        + [Severity.SEVERE] * n_severe
    )
    return plan


def generate_dataset(n: int = N_PATIENTS, seed: int = SEED) -> List[SyntheticPatient]:
    rng = random.Random(seed)
    plan = build_severity_plan(n)
    rng.shuffle(plan)  # baraja el orden manteniendo las proporciones

    patients = [generate_patient(rng, i + 1, severity) for i, severity in enumerate(plan)]
    return patients


# ---------------------------------------------------------------------------
# Persistencia
# ---------------------------------------------------------------------------
def save_jsonl(patients: List[SyntheticPatient], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as fh:
        for p in patients:
            record = p.model_dump() if _PYDANTIC_V2 else p.dict()
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")


# ---------------------------------------------------------------------------
# Reporte / logging
# ---------------------------------------------------------------------------
def log_summary(patients: List[SyntheticPatient], output_path: Path) -> None:
    total = len(patients)
    positives = sum(p.target_candidate_biologic for p in patients)
    by_sev = {s: 0 for s in Severity}
    for p in patients:
        by_sev[p.severity_label] += 1

    logger.info("Dataset generado: %d pacientes -> %s", total, output_path)
    logger.info("Positivos (candidatos a biológico): %d (%.1f%%)", positives, 100 * positives / total)
    logger.info(
        "Distribución severidad -> leve: %d (%.0f%%) | moderado: %d (%.0f%%) | severo: %d (%.0f%%)",
        by_sev[Severity.MILD], 100 * by_sev[Severity.MILD] / total,
        by_sev[Severity.MODERATE], 100 * by_sev[Severity.MODERATE] / total,
        by_sev[Severity.SEVERE], 100 * by_sev[Severity.SEVERE] / total,
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
def main() -> None:
    logger.info("Generando EHR sintéticos (seed=%d, n=%d)...", SEED, N_PATIENTS)
    patients = generate_dataset(N_PATIENTS, SEED)
    save_jsonl(patients, OUTPUT_PATH)
    log_summary(patients, OUTPUT_PATH)
    logger.info("Proceso completado correctamente.")


if __name__ == "__main__":
    main()
