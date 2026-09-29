"""
sync_artifacts_s3.py
====================

Sincronización de artefactos MLOps a Amazon S3 con trazabilidad (RADIANT CDSS).

Sube el dataset procesado y los artefactos del modelo a un bucket S3 bajo rutas
versionadas, y genera un manifest.json de linaje (timestamp, SHA256 del dataset,
métricas clínicas y versión del pipeline).

Rutas destino:
    s3://<bucket>/data/v1/features_patients.parquet
    s3://<bucket>/models/v1/xgb_biologic_detector.json
    s3://<bucket>/models/v1/feature_names.json
    s3://<bucket>/lineage/manifest.json

Uso:
    python src/cloud/sync_artifacts_s3.py

Requiere credenciales AWS. Reutiliza aws_setup para identidad y bucket.
"""

from __future__ import annotations

import hashlib
import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError

# ---------------------------------------------------------------------------
# Imports del proyecto
# ---------------------------------------------------------------------------
_CLOUD_DIR = Path(__file__).resolve().parent
if str(_CLOUD_DIR) not in sys.path:
    sys.path.insert(0, str(_CLOUD_DIR))

from aws_setup import bucket_name_for, ensure_bucket, get_caller_identity  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("sync_s3")

# ---------------------------------------------------------------------------
# Rutas locales
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[2]
PARQUET_PATH = PROJECT_ROOT / "data" / "processed" / "features_patients.parquet"
MODEL_PATH = PROJECT_ROOT / "models" / "xgb_biologic_detector.json"
FEATURE_NAMES_PATH = PROJECT_ROOT / "models" / "feature_names.json"
MANIFEST_PATH = PROJECT_ROOT / "models" / "manifest.json"

PIPELINE_VERSION = "v1.0-bedrock-hybrid"

# Claves S3 destino
S3_KEY_PARQUET = "data/v1/features_patients.parquet"
S3_KEY_MODEL = "models/v1/xgb_biologic_detector.json"
S3_KEY_FEATURES = "models/v1/feature_names.json"
S3_KEY_MANIFEST = "lineage/manifest.json"


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _check_local_artifacts() -> None:
    missing = [str(p) for p in (PARQUET_PATH, MODEL_PATH, FEATURE_NAMES_PATH) if not p.exists()]
    if missing:
        raise FileNotFoundError(
            "Faltan artefactos locales: "
            + ", ".join(missing)
            + ". Ejecuta los Pasos 2 y 3 antes de sincronizar."
        )


def _collect_metrics() -> Dict[str, Optional[float]]:
    """
    Recupera métricas clínicas del último run de MLflow si están disponibles.
    Devuelve None por métrica si no se pueden leer (no bloquea la subida).
    """
    metrics = {"accuracy": None, "recall": None, "roc_auc": None}
    try:
        import mlflow

        client = mlflow.tracking.MlflowClient()
        exp = client.get_experiment_by_name("pediatric_da_biologic_scoring")
        if exp is None:
            return metrics
        runs = client.search_runs([exp.experiment_id], order_by=["attributes.start_time DESC"],
                                  max_results=1)
        if not runs:
            return metrics
        run_metrics = runs[0].data.metrics
        for key in metrics:
            if key in run_metrics:
                metrics[key] = float(run_metrics[key])
    except Exception as exc:  # pragma: no cover - MLflow opcional
        logger.warning("No se pudieron leer métricas de MLflow: %s", exc)
    return metrics


def build_manifest() -> dict:
    dataset_hash = sha256_of(PARQUET_PATH)
    metrics = _collect_metrics()
    manifest = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "pipeline_version": PIPELINE_VERSION,
        "dataset_sha256": dataset_hash,
        "clinical_metrics": {
            "accuracy": metrics["accuracy"],
            "recall": metrics["recall"],
            "roc_auc": metrics["roc_auc"],
        },
        "artifacts": {
            "data": f"{S3_KEY_PARQUET}",
            "model": f"{S3_KEY_MODEL}",
            "feature_names": f"{S3_KEY_FEATURES}",
        },
    }
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info("Manifest de linaje generado en %s", MANIFEST_PATH)
    return manifest


# ---------------------------------------------------------------------------
# Subida
# ---------------------------------------------------------------------------
def _upload(s3, bucket: str, local_path: Path, key: str) -> str:
    s3.upload_file(str(local_path), bucket, key)
    uri = f"s3://{bucket}/{key}"
    logger.info("Subido: %s -> %s", local_path.name, uri)
    return uri


def sync(region_override: Optional[str] = None) -> Optional[dict]:
    t0 = time.perf_counter()
    _check_local_artifacts()

    session = boto3.Session()
    identity = get_caller_identity(session)
    if identity is None:
        logger.error("Sin credenciales AWS válidas. Abortando sincronización.")
        return None

    account_id = identity["Account"]
    region = region_override or identity["Region"]
    bucket = bucket_name_for(account_id)

    if not ensure_bucket(session, bucket, region):
        logger.error("No se pudo asegurar el bucket %s. Abortando.", bucket)
        return None

    manifest = build_manifest()

    s3 = session.client("s3", region_name=region)
    uris = {}
    try:
        uris["data"] = _upload(s3, bucket, PARQUET_PATH, S3_KEY_PARQUET)
        uris["model"] = _upload(s3, bucket, MODEL_PATH, S3_KEY_MODEL)
        uris["feature_names"] = _upload(s3, bucket, FEATURE_NAMES_PATH, S3_KEY_FEATURES)
        uris["manifest"] = _upload(s3, bucket, MANIFEST_PATH, S3_KEY_MANIFEST)
    except (ClientError, BotoCoreError) as exc:
        logger.error("Error subiendo artefactos a S3: %s", exc)
        return None

    elapsed = time.perf_counter() - t0
    logger.info("=== Sincronización completada en %.2f s ===", elapsed)
    for name, uri in uris.items():
        logger.info("  %-14s : %s", name, uri)

    return {"bucket": bucket, "region": region, "uris": uris, "manifest": manifest}


def main() -> None:
    sync()


if __name__ == "__main__":
    main()
