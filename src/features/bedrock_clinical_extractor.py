"""
bedrock_clinical_extractor.py
=============================

Extractor semántico médico con Amazon Bedrock (Claude 3 Haiku) para RADIANT CDSS.

Procesa la nota clínica anonimizada y devuelve un dict con banderas clínicas:
    {
        "refractariedad_corticoides": bool,
        "impacto_calidad_vida": bool,
        "afectacion_zonas_sensibles": bool,
        "sospecha_candidato_biologico": bool,
        "_source": "bedrock" | "heuristic_fallback"
    }

Robustez: si Bedrock no está accesible (sin credenciales, sin acceso al modelo,
error de permisos o región sin soporte), recurre de forma limpia a las reglas
heurísticas/regex ya implementadas en anonymize_and_extract.py, para no bloquear
el pipeline.

Uso:
    python src/features/bedrock_clinical_extractor.py
"""

from __future__ import annotations

import json
import logging
import re
import sys
from pathlib import Path
from typing import Dict, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("bedrock_extractor")

# ---------------------------------------------------------------------------
# Reutilización de las heurísticas del Paso 2 (fallback)
# ---------------------------------------------------------------------------
_FEATURES_DIR = Path(__file__).resolve().parent
if str(_FEATURES_DIR) not in sys.path:
    sys.path.insert(0, str(_FEATURES_DIR))

from anonymize_and_extract import extract_text_flags  # noqa: E402

MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"

# Claves del contrato de salida
OUTPUT_KEYS = [
    "refractariedad_corticoides",
    "impacto_calidad_vida",
    "afectacion_zonas_sensibles",
    "sospecha_candidato_biologico",
]

PROMPT_TEMPLATE = """Eres un asistente clínico experto en dermatología pediátrica.
Analiza la siguiente nota clínica (anonimizada) de un paciente con dermatitis atópica.

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown,
con EXACTAMENTE estas claves booleanas (true/false):

{{
  "refractariedad_corticoides": <true si hay fallo, refractariedad o rebote al suspender/espaciar corticoides>,
  "impacto_calidad_vida": <true si hay insomnio grave, alteración familiar o absentismo escolar>,
  "afectacion_zonas_sensibles": <true si afecta cara, párpados, cuello o pliegues>,
  "sospecha_candidato_biologico": <true si el cuadro cualitativo sugiere candidatura a terapia biológica>
}}

NOTA CLÍNICA:
\"\"\"{note}\"\"\"

JSON:"""


# ---------------------------------------------------------------------------
# Fallback heurístico (mapea las banderas del Paso 2 al contrato de salida)
# ---------------------------------------------------------------------------
def heuristic_extract(note: str) -> Dict[str, bool]:
    flags = extract_text_flags(note or "")
    refractariedad = bool(flags["feat_fallo_corticoide"])
    calidad_vida = bool(flags["feat_trastorno_sueno"] or flags["feat_absentismo_escolar"])
    zonas = bool(flags["feat_zonas_criticas"])
    prurito = bool(flags["feat_prurito_intenso"])
    # Criterio cualitativo: refractariedad + (impacto o prurito intenso) + zonas sensibles
    candidato = refractariedad and (calidad_vida or prurito)
    return {
        "refractariedad_corticoides": refractariedad,
        "impacto_calidad_vida": calidad_vida,
        "afectacion_zonas_sensibles": zonas,
        "sospecha_candidato_biologico": candidato,
        "_source": "heuristic_fallback",
    }


# ---------------------------------------------------------------------------
# Parseo robusto de la respuesta del LLM
# ---------------------------------------------------------------------------
def _parse_llm_json(text: str) -> Optional[Dict[str, bool]]:
    """Extrae el primer objeto JSON del texto y valida el contrato de claves."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    result = {}
    for key in OUTPUT_KEYS:
        if key not in data:
            return None
        result[key] = bool(data[key])
    return result


# ---------------------------------------------------------------------------
# Llamada a Bedrock
# ---------------------------------------------------------------------------
def _invoke_bedrock(note: str, region: Optional[str] = None) -> Optional[Dict[str, bool]]:
    try:
        import boto3
        from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError
    except ImportError:
        logger.warning("boto3 no instalado; usando fallback heurístico.")
        return None

    try:
        session = boto3.Session()
        client = session.client("bedrock-runtime", region_name=region or session.region_name)
    except Exception as exc:  # pragma: no cover - configuración de cliente
        logger.warning("No se pudo crear el cliente bedrock-runtime: %s", exc)
        return None

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "temperature": 0,
        "messages": [
            {"role": "user", "content": PROMPT_TEMPLATE.format(note=note)}
        ],
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(body),
            contentType="application/json",
            accept="application/json",
        )
        payload = json.loads(response["body"].read())
        # Formato Messages API de Anthropic en Bedrock
        text = "".join(
            block.get("text", "")
            for block in payload.get("content", [])
            if block.get("type") == "text"
        )
        parsed = _parse_llm_json(text)
        if parsed is None:
            logger.warning("Respuesta de Bedrock no parseable como JSON válido; fallback.")
            return None
        parsed["_source"] = "bedrock"
        return parsed
    except (NoCredentialsError, ClientError, BotoCoreError) as exc:
        logger.warning("Bedrock inaccesible (%s); usando fallback heurístico.",
                       type(exc).__name__)
        return None
    except Exception as exc:  # pragma: no cover - salvaguarda genérica
        logger.warning("Error inesperado invocando Bedrock (%s); fallback.", exc)
        return None


# ---------------------------------------------------------------------------
# API pública
# ---------------------------------------------------------------------------
def extract_clinical_semantics(note: str, region: Optional[str] = None) -> Dict[str, bool]:
    """
    Extrae banderas clínicas de la nota. Intenta Bedrock; si falla, usa heurística.
    """
    result = _invoke_bedrock(note, region=region)
    if result is not None:
        logger.info("Extracción semántica vía Bedrock (%s).", MODEL_ID)
        return result
    logger.info("Extracción semántica vía reglas heurísticas (fallback).")
    return heuristic_extract(note)


# ---------------------------------------------------------------------------
# Caso de prueba
# ---------------------------------------------------------------------------
def _demo() -> None:
    sample_note = (
        "[<HOSPITAL>] Consulta de <FECHA> — <MEDICO>. Paciente: <PACIENTE>, 8 años. "
        "Brote severo con eccema en cara y pliegues. Prurito intenso e intratable con "
        "rascado continuo. Alteración grave del sueño e insomnio familiar. Absentismo "
        "escolar. No hay respuesta tras semanas de corticoterapia tópica de alta potencia, "
        "con recaída al espaciar aplicaciones."
    )
    result = extract_clinical_semantics(sample_note)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    _demo()
