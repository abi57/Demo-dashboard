import os
import uuid
import boto3
from fastapi import UploadFile
from config import get_settings

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")


def _s3_client():
    settings = get_settings()
    kwargs = {
        "aws_access_key_id": settings.S3_ACCESS_KEY,
        "aws_secret_access_key": settings.S3_SECRET_KEY,
        "region_name": settings.S3_REGION,
    }
    if settings.S3_ENDPOINT_URL:
        kwargs["endpoint_url"] = settings.S3_ENDPOINT_URL
    return boto3.client("s3", **kwargs)


async def save_file(file: UploadFile, folder: str) -> tuple[str, str]:
    """Save file and return (storage_key, public_url)."""
    ext = os.path.splitext(file.filename or "file")[1]
    unique_name = f"{folder}/{uuid.uuid4().hex}{ext}"
    content = await file.read()
    settings = get_settings()

    if settings.USE_LOCAL_STORAGE:
        path = os.path.join(UPLOAD_DIR, unique_name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(content)
        url = f"/uploads/{unique_name}"
        return unique_name, url
    else:
        client = _s3_client()
        client.put_object(
            Bucket=settings.S3_BUCKET,
            Key=unique_name,
            Body=content,
            ContentType=file.content_type or "application/octet-stream",
        )
        if settings.S3_ENDPOINT_URL:
            url = f"{settings.S3_ENDPOINT_URL}/{settings.S3_BUCKET}/{unique_name}"
        else:
            url = f"https://{settings.S3_BUCKET}.s3.{settings.S3_REGION}.amazonaws.com/{unique_name}"
        return unique_name, url


async def delete_file(storage_key: str):
    """Delete file from storage."""
    settings = get_settings()
    if settings.USE_LOCAL_STORAGE:
        path = os.path.join(UPLOAD_DIR, storage_key)
        if os.path.exists(path):
            os.remove(path)
    else:
        client = _s3_client()
        client.delete_object(Bucket=settings.S3_BUCKET, Key=storage_key)
