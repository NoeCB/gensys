"""
aws_setup.py
============

Verificación de entorno y conectividad AWS para RADIANT CDSS (capa cloud).

Responsabilidades:
    1. Validar la sesión activa con STS (get_caller_identity).
    2. Imprimir Account ID, ARN y región activa.
    3. Crear (idempotente) el bucket clínico
       radiant-pediatric-mlops-<account_id> en la región configurada,
       activando versionado si es posible.

Uso:
    python src/cloud/aws_setup.py

Requiere credenciales AWS configuradas (variables de entorno, perfil o rol).
"""

from __future__ import annotations

import logging
from typing import Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError, NoCredentialsError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("aws_setup")

BUCKET_PREFIX = "radiant-pediatric-mlops"


# ---------------------------------------------------------------------------
# Identidad / conectividad
# ---------------------------------------------------------------------------
def get_caller_identity(session: Optional[boto3.Session] = None) -> Optional[dict]:
    """Valida la sesión y devuelve la identidad (o None si no hay credenciales)."""
    session = session or boto3.Session()
    try:
        sts = session.client("sts")
        identity = sts.get_caller_identity()
    except (NoCredentialsError, ClientError, BotoCoreError) as exc:
        logger.error("No se pudo validar la sesión AWS: %s", exc)
        return None

    region = session.region_name or "us-east-1"
    logger.info("=== Identidad AWS ===")
    logger.info("  Account ID : %s", identity.get("Account"))
    logger.info("  ARN        : %s", identity.get("Arn"))
    logger.info("  Región     : %s", region)
    return {**identity, "Region": region}


def bucket_name_for(account_id: str) -> str:
    return f"{BUCKET_PREFIX}-{account_id}"


# ---------------------------------------------------------------------------
# Creación idempotente del bucket
# ---------------------------------------------------------------------------
def _bucket_exists(s3_client, bucket: str) -> bool:
    try:
        s3_client.head_bucket(Bucket=bucket)
        return True
    except ClientError as exc:
        code = exc.response.get("Error", {}).get("Code", "")
        if code in ("404", "NoSuchBucket"):
            return False
        if code in ("403",):
            # Existe pero pertenece a otra cuenta o sin permiso de head
            logger.warning("head_bucket devolvió 403 para %s (posible propiedad ajena).", bucket)
            return True
        raise


def ensure_bucket(session: boto3.Session, bucket: str, region: str) -> bool:
    """Crea el bucket si no existe y activa versionado. Devuelve True si OK."""
    s3 = session.client("s3", region_name=region)

    try:
        if _bucket_exists(s3, bucket):
            logger.info("Bucket ya existe: s3://%s", bucket)
        else:
            # us-east-1 no admite LocationConstraint
            if region == "us-east-1":
                s3.create_bucket(Bucket=bucket)
            else:
                s3.create_bucket(
                    Bucket=bucket,
                    CreateBucketConfiguration={"LocationConstraint": region},
                )
            logger.info("Bucket creado: s3://%s (%s)", bucket, region)

        # Versionado (best-effort)
        try:
            s3.put_bucket_versioning(
                Bucket=bucket,
                VersioningConfiguration={"Status": "Enabled"},
            )
            logger.info("Versionado activado en s3://%s", bucket)
        except ClientError as exc:
            logger.warning("No se pudo activar versionado: %s", exc)

        return True
    except (ClientError, BotoCoreError) as exc:
        logger.error("Error asegurando el bucket %s: %s", bucket, exc)
        return False


# ---------------------------------------------------------------------------
# Orquestación
# ---------------------------------------------------------------------------
def setup() -> Optional[dict]:
    session = boto3.Session()
    identity = get_caller_identity(session)
    if identity is None:
        logger.error(
            "Configura tus credenciales AWS (aws configure, variables de entorno "
            "o rol IAM) y vuelve a intentarlo."
        )
        return None

    account_id = identity["Account"]
    region = identity["Region"]
    bucket = bucket_name_for(account_id)

    ok = ensure_bucket(session, bucket, region)
    result = {
        "account_id": account_id,
        "arn": identity.get("Arn"),
        "region": region,
        "bucket": bucket,
        "bucket_ready": ok,
    }
    if ok:
        logger.info("Setup completado. Bucket clínico listo: s3://%s", bucket)
    return result


def main() -> None:
    setup()


if __name__ == "__main__":
    main()
