import os
import uuid
import shutil
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

_EXT_TO_MIME = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".heic": "image/heic", ".heif": "image/heif",
    ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
    ".avi": "video/x-msvideo", ".mkv": "video/x-matroska", ".3gp": "video/3gpp",
    ".mpeg": "video/mpeg",
}

_VIDEO_EXTS = {".mp4", ".mov", ".webm", ".avi", ".mkv", ".3gp", ".mpeg"}


def _get_s3_client():
    settings = get_settings()
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.s3_region,
    )


def _resolve_content_type(file: UploadFile, ext: str) -> str:
    """Determine the content type from the file header or extension."""
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        content_type = _EXT_TO_MIME.get(ext.lower(), content_type)
    return content_type


async def save_file(file: UploadFile, folder: str) -> tuple[str, str, int]:
    """Save uploaded file by streaming chunks to disk.
    Handles large 4K videos without loading entire file into RAM.
    Returns (storage_key, public_url, file_size)."""
    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    unique_name = f"{folder}/{uuid.uuid4().hex}{ext}"
    settings = get_settings()

    # Determine if this is a video to set the correct size limit
    is_video = (file.content_type or "").startswith("video/") or ext.lower() in _VIDEO_EXTS
    max_size = MAX_VIDEO_SIZE if is_video else MAX_IMAGE_SIZE

    # Stream to a temp file on disk (avoids loading 500MB into RAM)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    tmp_path = os.path.join(UPLOAD_DIR, f".tmp_{uuid.uuid4().hex}{ext}")
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB chunks

    try:
        with open(tmp_path, "wb") as tmp:
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > max_size:
                    raise ValueError(f"File too large. Max {max_size // (1024 * 1024)}MB")
                tmp.write(chunk)

        if file_size == 0:
            raise ValueError("Empty file")

        # Resolve content type
        content_type = _resolve_content_type(file, ext)

        if settings.s3_configured and not settings.USE_LOCAL_STORAGE:
            client = _get_s3_client()
            bucket = settings.s3_bucket

            try:
                with open(tmp_path, "rb") as f:
                    client.put_object(
                        Bucket=bucket,
                        Key=unique_name,
                        Body=f,
                        ContentType=content_type,
                    )
            except ClientError as e:
                raise ValueError(f"S3 upload failed: {e}")

            endpoint = settings.s3_endpoint.rstrip("/")
            endpoint_host = endpoint.replace("https://", "").replace("http://", "")
            public_url = f"https://{bucket}.{endpoint_host}/{unique_name}"

            return unique_name, public_url, file_size
        else:
            # Move temp file to final location
            final_path = os.path.join(UPLOAD_DIR, unique_name)
            os.makedirs(os.path.dirname(final_path), exist_ok=True)
            shutil.move(tmp_path, final_path)
            return unique_name, f"/uploads/{unique_name}", file_size

    finally:
        # Always clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


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
