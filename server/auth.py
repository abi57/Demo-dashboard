from typing import Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt
from config import get_settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(company_id: str) -> str:
    settings = get_settings()
    if not settings.JWT_SECRET:
        raise ValueError("JWT_SECRET environment variable is not set")
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode({"sub": company_id, "exp": expire}, settings.JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> Optional[str]:
    try:
        settings = get_settings()
        if not settings.JWT_SECRET:
            return None
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except JWTError:
        return None
