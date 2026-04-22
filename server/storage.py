import os
import uuid
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from config import get_settings

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")

# Allowed file types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska", "video/3gpp", "video/mpeg"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES

# Max file sizes
MAX_IMAGE_SIZE = 20 * 1024 * 1024   # 20MB
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB


def _get_s3_client():
    settings = get_settings()
    return boto3.client(
        "s3",
        endpoint_url=settings.AWS_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_DEFAULT_REGION,
    )


def validate_file(file: UploadFile, content: bytes):
    """Validate file type and size."""
    content_type = file.content_type or ""

    if content_type not in ALLOWED_TYPES:
        # Try to guess from extension
        ext = os.path.splitext(file.filename or "")[1].lower()
        ext_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                   ".webp": "image/webp", ".heic": "image/heic", ".mp4": "video/mp4",
                   ".mov": "video/quicktime", ".webm": "video/webm", ".avi": "video/x-msvideo"}
        content_type = ext_map.get(ext, content_type)

    is_video = content_type.startswith("video/")
    max_size = MAX_VIDEO_SIZE if is_video else MAX_IMAGE_SIZE

    if len(content) > max_size:
        size_mb = max_size // (1024 * 1024)
        raise ValueError(f"File too large. Maximum {size_mb}MB for {'videos' if is_video else 'images'}")

    return content_type


async def save_file(file: UploadFile, folder: str) -> tuple[str, str, int]:
    """Save file to S3 or local disk. Returns (storage_key, public_url, file_size)."""
    content = await file.read()
    content_type = validate_file(file, content)
    file_size = len(content)

    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    unique_name = f"{folder}/{uuid.uuid4().hex}{ext}"
    settings = get_settings()

    if settings.s3_configured and not settings.USE_LOCAL_STORAGE:
        # Upload to S3
        client = _get_s3_client()
        bucket = settings.AWS_S3_BUCKET_NAME

        try:
            client.put_object(
                Bucket=bucket,
                Key=unique_name,
                Body=content,
                ContentType=content_type,
            )
        except ClientError as e:
            raise ValueError(f"S3 upload failed: {e}")

        # Build public URL
        endpoint = settings.AWS_ENDPOINT_URL.rstrip("/")
        public_url = f"{endpoint}/{bucket}/{unique_name}"

        return unique_name, public_url, file_size
    else:
        # Local storage fallback
        path = os.path.join(UPLOAD_DIR, unique_name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(content)
        local_url = f"/uploads/{unique_name}"
        return unique_name, local_url, file_size


async def delete_file(storage_key: str):
    """Delete file from S3 or local disk."""
    settings = get_settings()

    if settings.s3_configured and not settings.USE_LOCAL_STORAGE:
        try:
            client = _get_s3_client()
            client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=storage_key)
        except ClientError:
            pass  # File may already be deleted
    else:
        path = os.path.join(UPLOAD_DIR, storage_key)
        if os.path.exists(path):
            os.remove(path)
