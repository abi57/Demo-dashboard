"""Run this once to create initial company accounts in the database.
Usage: python seed_db.py
"""
import asyncio
from sqlalchemy import select
from database import engine, Base, SessionLocal
from models import Company
from auth import hash_password

COMPANIES = [
    {"name": "Titanium Services Group", "password": "engineer123"},
    {"name": "All Heights Ltd", "password": "engineer123"},
    {"name": "Downer", "password": "engineer123"},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        for c in COMPANIES:
            result = await db.execute(select(Company).where(Company.name == c["name"]))
            if result.scalar_one_or_none():
                print(f"  ✓ {c['name']} already exists")
                continue
            db.add(Company(name=c["name"], password_hash=hash_password(c["password"])))
            print(f"  + Created {c['name']}")
        await db.commit()

    print("\nDone. Companies seeded.")


if __name__ == "__main__":
    asyncio.run(seed())
