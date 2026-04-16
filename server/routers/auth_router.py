from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Company
from schemas import LoginRequest, LoginResponse, ChangePasswordRequest
from auth import verify_password, hash_password, create_token
from dependencies import get_current_company

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Company).where(Company.name.ilike(body.company))
    )
    company = result.scalar_one_or_none()
    if not company or not verify_password(body.password, company.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid company name or password",
        )
    token = create_token(company.id)
    return LoginResponse(token=token, company_id=company.id, company_name=company.name)


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    company: Company = Depends(get_current_company),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(body.current_password, company.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    company.password_hash = hash_password(body.new_password)
    db.add(company)
    await db.commit()
    return {"message": "Password changed successfully"}
