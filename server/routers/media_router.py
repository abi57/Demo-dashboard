from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Company, Installation, Media
from schemas import MediaOut
from dependencies import get_current_company
from storage import save_file, delete_file

router = APIRouter(prefix="/api/media", tags=["media"])


@router.post("/upload", response_model=MediaOut, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    installation_id: str = Form(...),
    media_type: str = Form(...),  # serial_photo, install_photo, video
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    # Verify installation belongs to company
    result = await db.execute(
        select(Installation).where(
            Installation.id == installation_id,
            Installation.company_id == company.id,
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Installation not found")

    if media_type not in ("serial_photo", "install_photo", "video"):
        raise HTTPException(status_code=400, detail="Invalid media_type")

    folder = f"{company.id}/{installation_id}/{media_type}"
    storage_key, url = await save_file(file, folder)

    media = Media(
        installation_id=installation_id,
        media_type=media_type,
        filename=file.filename or "file",
        storage_key=url,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)

    return MediaOut(
        id=media.id, media_type=media.media_type,
        filename=media.filename, url=media.storage_key,
        uploaded_at=media.uploaded_at,
    )


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
    return [
        MediaOut(id=m.id, media_type=m.media_type, filename=m.filename,
                 url=m.storage_key, uploaded_at=m.uploaded_at)
        for m in result.scalars().all()
    ]


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

    # Verify ownership
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
