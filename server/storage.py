import os
import uuid
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from config import get_settings

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska", "video/3gpp", "video/mpeg"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES
MAX_IMAGE_SIZE = 20 * 1024 * 1024
MAX_VIDEO_SIZE = 500 * 1024 * 1024


def _get_s3_client():
    settings = get_settings()
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.s3_region,
    )


def validate_file(file: UploadFile, content: bytes):
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        ext = os.path.splitext(file.filename or "")[1].lower()
        ext_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                   ".webp": "image/webp", ".heic": "image/heic", ".mp4": "video/mp4",
                   ".mov": "video/quicktime", ".webm": "video/webm", ".avi": "video/x-msvideo"}
        content_type = ext_map.get(ext, content_type)
    is_video = content_type.startswith("video/")
    max_size = MAX_VIDEO_SIZE if is_video else MAX_IMAGE_SIZE
    if len(content) > max_size:
        raise ValueError(f"File too large. Max {max_size // (1024*1024)}MB")
    return content_type


async def save_file(file: UploadFile, folder: str) -> tuple[str, str, int]:
    """Save file. Returns (storage_key, public_url, file_size)."""
    content = await file.read()
    content_type = validate_file(file, content)
    file_size = len(content)
    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    unique_name = f"{folder}/{uuid.uuid4().hex}{ext}"
    settings = get_settings()

    if settings.s3_configured and not settings.USE_LOCAL_STORAGE:
        client = _get_s3_client()
        bucket = settings.s3_bucket

        try:
            client.put_object(
                Bucket=bucket,
                Key=unique_name,
                Body=content,
                ContentType=content_type,
            )
        except ClientError as e:
            raise ValueError(f"S3 upload failed: {e}")

        # Railway uses virtual-hosted-style URLs:
        # https://{bucket}.{endpoint_host}/{key}
        endpoint = settings.s3_endpoint.rstrip("/")
        endpoint_host = endpoint.replace("https://", "").replace("http://", "")
        public_url = f"https://{bucket}.{endpoint_host}/{unique_name}"

        return unique_name, public_url, file_size
    else:
        path = os.path.join(UPLOAD_DIR, unique_name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(content)
        return unique_name, f"/uploads/{unique_name}", file_size


async def delete_file(storage_key: str):
    settings = get_settings()
    if settings.s3_configured and not settings.USE_LOCAL_STORAGE:
        try:
            client = _get_s3_client()
            client.delete_object(Bucket=settings.s3_bucket, Key=storage_key)
        except ClientError:
            pass
    else:
        path = os.path.join(UPLOAD_DIR, storage_key)
        if os.path.exists(path):
            os.remove(path)


def generate_presigned_url(storage_key: str, expires_in: int = 3600) -> str:
    """Generate a presigned GET URL for a private S3 object. Default 1 hour expiry."""
    settings = get_settings()
    if not settings.s3_configured:
        return f"/uploads/{storage_key}"

    client = _get_s3_client()
    try:
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.s3_bucket, "Key": storage_key},
            ExpiresIn=expires_in,
        )
        return url
    except ClientError:
        return ""
