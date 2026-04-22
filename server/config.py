import os
from functools import lru_cache

_ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        DATABASE_URL: str = ""
        JWT_SECRET: str = ""
        JWT_EXPIRE_MINUTES: int = 1440
        USE_LOCAL_STORAGE: bool = False
        PORT: int = 8080

        # Railway injects these with various possible names
        # Try every known format
        BUCKET_ENDPOINT: str = ""
        BUCKET_NAME: str = ""
        BUCKET_ACCESS_KEY_ID: str = ""
        BUCKET_SECRET_ACCESS_KEY: str = ""
        BUCKET_REGION: str = ""

        AWS_ENDPOINT_URL: str = ""
        AWS_ACCESS_KEY_ID: str = ""
        AWS_SECRET_ACCESS_KEY: str = ""
        AWS_S3_BUCKET_NAME: str = ""
        AWS_DEFAULT_REGION: str = ""

        S3_ENDPOINT: str = ""
        S3_ACCESS_KEY: str = ""
        S3_SECRET_KEY: str = ""
        S3_BUCKET: str = ""
        S3_REGION: str = ""

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
        def s3_endpoint(self) -> str:
            return self.BUCKET_ENDPOINT or self.AWS_ENDPOINT_URL or self.S3_ENDPOINT or ""

        @property
        def s3_bucket(self) -> str:
            return self.BUCKET_NAME or self.AWS_S3_BUCKET_NAME or self.S3_BUCKET or ""

        @property
        def s3_access_key(self) -> str:
            return self.BUCKET_ACCESS_KEY_ID or self.AWS_ACCESS_KEY_ID or self.S3_ACCESS_KEY or ""

        @property
        def s3_secret_key(self) -> str:
            return self.BUCKET_SECRET_ACCESS_KEY or self.AWS_SECRET_ACCESS_KEY or self.S3_SECRET_KEY or ""

        @property
        def s3_region(self) -> str:
            return self.BUCKET_REGION or self.AWS_DEFAULT_REGION or self.S3_REGION or "auto"

        @property
        def s3_configured(self) -> bool:
            return bool(self.s3_endpoint and self.s3_access_key and self.s3_bucket)

except ImportError:
    class Settings:
        def __init__(self):
            self.DATABASE_URL = os.environ.get("DATABASE_URL", "")
            self.JWT_SECRET = os.environ.get("JWT_SECRET", "")
            self.JWT_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "1440"))
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

        def _env(self, *keys):
            for k in keys:
                v = os.environ.get(k, "")
                if v: return v
            return ""

        @property
        def s3_endpoint(self):
            return self._env("BUCKET_ENDPOINT", "AWS_ENDPOINT_URL", "S3_ENDPOINT")

        @property
        def s3_bucket(self):
            return self._env("BUCKET_NAME", "AWS_S3_BUCKET_NAME", "S3_BUCKET")

        @property
        def s3_access_key(self):
            return self._env("BUCKET_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID", "S3_ACCESS_KEY")

        @property
        def s3_secret_key(self):
            return self._env("BUCKET_SECRET_ACCESS_KEY", "AWS_SECRET_ACCESS_KEY", "S3_SECRET_KEY")

        @property
        def s3_region(self):
            return self._env("BUCKET_REGION", "AWS_DEFAULT_REGION", "S3_REGION") or "auto"

        @property
        def s3_configured(self):
            return bool(self.s3_endpoint and self.s3_access_key and self.s3_bucket)


@lru_cache
def get_settings():
    return Settings()
