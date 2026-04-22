from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database import get_db
from models import Company, Installation, ClimbLog, Media
from schemas import InstallationCreate, InstallationUpdate, InstallationOut, ClimbLogOut, MediaOut
from dependencies import get_current_company

router = APIRouter(prefix="/api/installations", tags=["installations"])


def _format(inst: Installation, company_name: str) -> InstallationOut:
    return InstallationOut(
        id=inst.id,
        company_id=inst.company_id,
        company_name=company_name,
        submitted_at=inst.submitted_at,
        installer_name=inst.installer_name,
        date_installed=inst.date_installed,
        site_owner=inst.site_owner,
        tower_id=inst.tower_id,
        sensor_serials=inst.sensor_serials,
        height_agl=inst.height_agl,
        accel_orientation=inst.accel_orientation,
        wind_orientation=inst.wind_orientation,
        structural_element=inst.structural_element,
        battery_voltage=inst.battery_voltage,
        dc_output=inst.dc_output,
        secure_fixing=inst.secure_fixing,
        data_flow=inst.data_flow,
        status=inst.status,
        climbs=[ClimbLogOut(id=c.id, climb_number=c.climb_number, up_start=c.up_start,
                up_finish=c.up_finish, down_start=c.down_start, down_finish=c.down_finish)
                for c in inst.climb_logs],
        media=[MediaOut(id=m.id, media_type=m.media_type, filename=m.filename,
               file_type=m.file_type or "", file_size=m.file_size or 0,
               url=m.public_url or m.storage_key, uploaded_at=m.uploaded_at)
               for m in inst.media],
    )


@router.get("", response_model=list[InstallationOut])
async def list_installations(
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation)
        .where(Installation.company_id == company.id)
        .options(selectinload(Installation.climb_logs), selectinload(Installation.media))
        .order_by(Installation.submitted_at.desc())
    )
    return [_format(i, company.name) for i in result.scalars().all()]


@router.get("/{inst_id}", response_model=InstallationOut)
async def get_installation(
    inst_id: str,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation)
        .where(Installation.id == inst_id, Installation.company_id == company.id)
        .options(selectinload(Installation.climb_logs), selectinload(Installation.media))
    )
    inst = result.scalar_one_or_none()
    if not inst:
        raise HTTPException(status_code=404, detail="Installation not found")
    return _format(inst, company.name)


@router.post("", response_model=InstallationOut, status_code=201)
async def create_installation(
    body: InstallationCreate,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    inst = Installation(
        company_id=company.id,
        installer_name=body.installer_name,
        date_installed=body.date_installed,
        site_owner=body.site_owner,
        tower_id=body.tower_id,
        sensor_serials=body.sensor_serials,
        height_agl=body.height_agl,
        accel_orientation=body.accel_orientation,
        wind_orientation=body.wind_orientation,
        structural_element=body.structural_element,
        battery_voltage=body.battery_voltage,
        dc_output=body.dc_output,
        secure_fixing=body.secure_fixing,
        data_flow=body.data_flow,
        status="confirmed" if body.data_flow else "pending",
    )
    db.add(inst)
    await db.flush()

    for c in body.climbs:
        db.add(ClimbLog(
            installation_id=inst.id, climb_number=c.climb_number,
            up_start=c.up_start, up_finish=c.up_finish,
            down_start=c.down_start, down_finish=c.down_finish,
        ))

    await db.commit()
    return await get_installation(inst.id, company, db)


@router.put("/{inst_id}", response_model=InstallationOut)
async def update_installation(
    inst_id: str,
    body: InstallationUpdate,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation)
        .where(Installation.id == inst_id, Installation.company_id == company.id)
        .options(selectinload(Installation.climb_logs))
    )
    inst = result.scalar_one_or_none()
    if not inst:
        raise HTTPException(status_code=404, detail="Installation not found")

    for field in ["installer_name", "date_installed", "site_owner", "tower_id",
                  "sensor_serials", "height_agl", "accel_orientation", "wind_orientation",
                  "structural_element", "battery_voltage", "dc_output", "secure_fixing", "data_flow"]:
        setattr(inst, field, getattr(body, field))
    inst.status = "confirmed" if body.data_flow else "pending"

    # Replace climb logs
    for old in inst.climb_logs:
        await db.delete(old)
    for c in body.climbs:
        db.add(ClimbLog(
            installation_id=inst.id, climb_number=c.climb_number,
            up_start=c.up_start, up_finish=c.up_finish,
            down_start=c.down_start, down_finish=c.down_finish,
        ))

    await db.commit()
    return await get_installation(inst_id, company, db)


@router.delete("/{inst_id}")
async def delete_installation(
    inst_id: str,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Installation)
        .where(Installation.id == inst_id, Installation.company_id == company.id)
    )
    inst = result.scalar_one_or_none()
    if not inst:
        raise HTTPException(status_code=404, detail="Installation not found")
    await db.delete(inst)
    await db.commit()
    return {"message": "Deleted"}
