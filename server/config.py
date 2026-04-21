import os
from functools import lru_cache

_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

# Only use pydantic-settings if available, otherwise pure env vars
try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        DATABASE_URL: str = ""
        JWT_SECRET: str = ""
        JWT_EXPIRE_MINUTES: int = 1440
        USE_LOCAL_STORAGE: bool = False
        PORT: int = 8080

        class Config:
            env_file = _ENV_FILE if os.path.exists(_ENV_FILE) else None
            extra = "ignore"

        @property
        def async_database_url(self) -> str:
            url = self.DATABASE_URL
            if not url:
                raise ValueError("DATABASE_URL environment variable is not set")
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif not url.startswith("postgresql+asyncpg://"):
                url = "postgresql+asyncpg://" + url
            return url

except ImportError:
    class Settings:
        def __init__(self):
            self.DATABASE_URL = os.environ.get("DATABASE_URL", "")
            self.JWT_SECRET = os.environ.get("JWT_SECRET", "")
            self.JWT_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "1440"))
            self.USE_LOCAL_STORAGE = os.environ.get("USE_LOCAL_STORAGE", "false").lower() == "true"
            self.PORT = int(os.environ.get("PORT", "8080"))

        @property
        def async_database_url(self) -> str:
            url = self.DATABASE_URL
            if not url:
                raise ValueError("DATABASE_URL environment variable is not set")
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url


@lru_cache
def get_settings():
    return Settings()
