from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    position: str
    department: str
    hire_date: date
    salary: float
    manager_id: Optional[str] = None
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    department: Optional[str] = None
    hire_date: Optional[date] = None
    salary: Optional[float] = None
    manager_id: Optional[str] = None
    is_active: Optional[bool] = None

class Employee(EmployeeBase):
    id: str

    class Config:
        from_attributes = True 