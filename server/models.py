import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Float, Boolean, Text, ForeignKey, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


def gen_id():
    return str(uuid.uuid4())[:8]


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    installations: Mapped[list["Installation"]] = relationship(back_populates="company_rel", cascade="all, delete-orphan")


class Installation(Base):
    __tablename__ = "installations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    company_id: Mapped[str] = mapped_column(ForeignKey("companies.id"), nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    installer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    date_installed: Mapped[str] = mapped_column(String(20), nullable=False)
    site_owner: Mapped[str] = mapped_column(String(200), nullable=False)
    tower_id: Mapped[str] = mapped_column(String(100), nullable=False)
    sensor_serials: Mapped[str] = mapped_column(Text, nullable=False)

    height_agl: Mapped[float] = mapped_column(Float, nullable=False)
    accel_orientation: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    wind_orientation: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    structural_element: Mapped[str] = mapped_column(String(200), nullable=False)

    battery_voltage: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    dc_output: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    secure_fixing: Mapped[bool] = mapped_column(Boolean, nullable=False)
    data_flow: Mapped[bool] = mapped_column(Boolean, nullable=False)

    status: Mapped[str] = mapped_column(String(20), default="pending")

    company_rel: Mapped["Company"] = relationship(back_populates="installations")
    climb_logs: Mapped[list["ClimbLog"]] = relationship(back_populates="installation", cascade="all, delete-orphan")
    media: Mapped[list["Media"]] = relationship(back_populates="installation", cascade="all, delete-orphan")


class ClimbLog(Base):
    __tablename__ = "climb_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    installation_id: Mapped[str] = mapped_column(ForeignKey("installations.id"), nullable=False)
    climb_number: Mapped[int] = mapped_column(Integer, nullable=False)

    up_start: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    up_finish: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    down_start: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    down_finish: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)

    installation: Mapped["Installation"] = relationship(back_populates="climb_logs")


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    installation_id: Mapped[str] = mapped_column(ForeignKey("installations.id"), nullable=False)
    media_type: Mapped[str] = mapped_column(String(30), nullable=False)
    filename: Mapped[str] = mapped_column(String(300), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    installation: Mapped["Installation"] = relationship(back_populates="media")
