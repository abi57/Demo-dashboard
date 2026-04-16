import os
from pydantic_settings import BaseSettings
from functools import lru_cache

_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/viotel"
    JWT_SECRET: str = "change-me"
    JWT_EXPIRE_MINUTES: int = 1440

    S3_BUCKET: str = "viotel-media"
    S3_REGION: str = "ap-southeast-2"
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_ENDPOINT_URL: str = ""

    USE_LOCAL_STORAGE: bool = True

    class Config:
        env_file = _ENV_FILE

    @property
    def async_database_url(self) -> str:
        """Convert Railway's postgresql:// URL to asyncpg format."""
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
