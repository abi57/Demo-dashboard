import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from sqlalchemy import select

from database import engine, Base, SessionLocal
from models import Company
from auth import hash_password
from routers.auth_router import router as auth_router
from routers.installations_router import router as installations_router
from routers.media_router import router as media_router

SEED_COMPANIES = [
    {"name": "Titanium Services Group", "password": "engineer123"},
    {"name": "All Heights Ltd", "password": "engineer123"},
    {"name": "Downer", "password": "engineer123"},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with SessionLocal() as db:
        result = await db.execute(select(Company).limit(1))
        if not result.scalar_one_or_none():
            for c in SEED_COMPANIES:
                db.add(Company(name=c["name"], password_hash=hash_password(c["password"])))
            await db.commit()
            print("Seeded initial companies")
    yield


app = FastAPI(title="Viotel API", version="1.0.0", lifespan=lifespan, redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth_router)
app.include_router(installations_router)
app.include_router(media_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
