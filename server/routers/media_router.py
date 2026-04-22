from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Company, Installation, Media
from schemas import MediaOut
from dependencies import get_current_company
from storage import save_file, delete_file, generate_presigned_url

router = APIRouter(prefix="/api/media", tags=["media"])

VALID_MEDIA_TYPES = {
    "serial_photo", "install_photo", "video",
    "video_position_1", "video_position_2",
}


def _media_to_out(m: Media) -> MediaOut:
    """Convert media record to output with presigned URL."""
    signed_url = generate_presigned_url(m.storage_key)
    return MediaOut(
        id=m.id,
        media_type=m.media_type,
        filename=m.filename,
        file_type=m.file_type or "",
        file_size=m.file_size or 0,
        url=signed_url or m.public_url or m.storage_key,
        uploaded_at=m.uploaded_at,
    )


@router.post("/upload", response_model=MediaOut, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    installation_id: str = Form(...),
    media_type: str = Form(...),
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation).where(
            Installation.id == installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Installation not found")

    if media_type not in VALID_MEDIA_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid media_type")

    folder = f"{company.id}/{installation_id}/{media_type}"
    try:
        storage_key, public_url, file_size = await save_file(file, folder)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    media = Media(
        installation_id=installation_id,
        media_type=media_type,
        filename=file.filename or "file",
        file_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        storage_key=storage_key,
        public_url=public_url,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return _media_to_out(media)


@router.get("/{installation_id}", response_model=list[MediaOut])
async def list_media(
    installation_id: str,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation).where(
            Installation.id == installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Installation not found")

    result = await db.execute(
        select(Media).where(Media.installation_id == installation_id)
        .order_by(Media.uploaded_at)
    )
    return [_media_to_out(m) for m in result.scalars().all()]


@router.get("/view/{media_id}")
async def get_view_url(
    media_id: int,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    """Get a fresh presigned URL for a specific media file."""
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    result = await db.execute(
        select(Installation).where(
            Installation.id == media.installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    signed_url = generate_presigned_url(media.storage_key, expires_in=3600)
    if not signed_url:
        raise HTTPException(status_code=500, detail="Could not generate URL")

    return {"url": signed_url, "filename": media.filename, "media_type": media.media_type}


@router.get("/detail/{media_id}", response_model=MediaOut)
async def get_media_detail(
    media_id: int,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    result = await db.execute(
        select(Installation).where(
            Installation.id == media.installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    return _media_to_out(media)


@router.delete("/{media_id}")
async def delete_media(
    media_id: int,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    result = await db.execute(
        select(Installation).where(
            Installation.id == media.installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    await delete_file(media.storage_key)
    await db.delete(media)
    await db.commit()
    return {"message": "Deleted"}
