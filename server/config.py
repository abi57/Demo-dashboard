import os
from functools import lru_cache

_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        DATABASE_URL: str = ""
        JWT_SECRET: str = ""
        JWT_EXPIRE_MINUTES: int = 1440

        # Railway S3 storage
        AWS_ENDPOINT_URL: str = ""
        AWS_ACCESS_KEY_ID: str = ""
        AWS_SECRET_ACCESS_KEY: str = ""
        AWS_S3_BUCKET_NAME: str = ""
        AWS_DEFAULT_REGION: str = "us-east-1"

        # Fallback local storage
        USE_LOCAL_STORAGE: bool = False

        PORT: int = 8080

        class Config:
            env_file = _ENV_FILE if os.path.exists(_ENV_FILE) else None
            extra = "ignore"

        @property
        def async_database_url(self) -> str:
            url = self.DATABASE_URL
            if not url:
                raise ValueError("DATABASE_URL is not set")
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url

        @property
        def s3_configured(self) -> bool:
            return bool(self.AWS_ENDPOINT_URL and self.AWS_ACCESS_KEY_ID and self.AWS_S3_BUCKET_NAME)

except ImportError:
    class Settings:
        def __init__(self):
            self.DATABASE_URL = os.environ.get("DATABASE_URL", "")
            self.JWT_SECRET = os.environ.get("JWT_SECRET", "")
            self.JWT_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "1440"))
            self.AWS_ENDPOINT_URL = os.environ.get("AWS_ENDPOINT_URL", "")
            self.AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
            self.AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
            self.AWS_S3_BUCKET_NAME = os.environ.get("AWS_S3_BUCKET_NAME", "")
            self.AWS_DEFAULT_REGION = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
            self.USE_LOCAL_STORAGE = os.environ.get("USE_LOCAL_STORAGE", "false").lower() == "true"
            self.PORT = int(os.environ.get("PORT", "8080"))

        @property
        def async_database_url(self):
            url = self.DATABASE_URL
            if not url:
                raise ValueError("DATABASE_URL is not set")
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url

        @property
        def s3_configured(self):
            return bool(self.AWS_ENDPOINT_URL and self.AWS_ACCESS_KEY_ID and self.AWS_S3_BUCKET_NAME)


@lru_cache
def get_settings():
    return Settings()
