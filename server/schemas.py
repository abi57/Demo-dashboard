from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class LoginRequest(BaseModel):
    company: str
    password: str

class LoginResponse(BaseModel):
    token: str
    company_id: str
    company_name: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ClimbLogIn(BaseModel):
    climb_number: int
    up_start: Optional[str] = None
    up_finish: Optional[str] = None
    down_start: Optional[str] = None
    down_finish: Optional[str] = None

class ClimbLogOut(ClimbLogIn):
    id: int


class MediaOut(BaseModel):
    id: int
    media_type: str
    filename: str
    file_type: str = ""
    file_size: int = 0
    url: str
    uploaded_at: datetime


class InstallationCreate(BaseModel):
    installer_name: str
    date_installed: str
    site_owner: str
    tower_id: str
    sensor_serials: str
    height_agl: float
    accel_orientation: Optional[float] = None
    wind_orientation: Optional[float] = None
    structural_element: str
    battery_voltage: Optional[str] = None
    dc_output: Optional[str] = None
    secure_fixing: bool
    data_flow: bool
    climbs: list[ClimbLogIn] = []

class InstallationUpdate(InstallationCreate):
    pass

class InstallationOut(BaseModel):
    id: str
    company_id: str
    company_name: str
    submitted_at: datetime
    installer_name: str
    date_installed: str
    site_owner: str
    tower_id: str
    sensor_serials: str
    height_agl: float
    accel_orientation: Optional[float]
    wind_orientation: Optional[float]
    structural_element: str
    battery_voltage: Optional[str]
    dc_output: Optional[str]
    secure_fixing: bool
    data_flow: bool
    status: str
    climbs: list[ClimbLogOut] = []
    media: list[MediaOut] = []
