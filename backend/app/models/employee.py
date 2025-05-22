from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date

class SkillModel(BaseModel):
    name: str
    level: Optional[int] = Field(None, ge=1, le=5)

class EmployeeBase(BaseModel):
    name: str
    email: Optional[str] = None
    position: str
    department: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    start_date: Optional[date] = None
    photo_url: Optional[str] = None
    manager_id: Optional[str] = None
    skills: Optional[List[str]] = []
    
class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    start_date: Optional[date] = None
    photo_url: Optional[str] = None
    manager_id: Optional[str] = None
    skills: Optional[List[str]] = None

class EmployeeInDB(EmployeeBase):
    id: str
    manager_name: Optional[str] = None
    created_at: date
    updated_at: date

    class Config:
        schema_extra = {
            "example": {
                "id": "5f8d0d55b54764421b71cc2d",
                "name": "John Doe",
                "email": "john.doe@example.com",
                "position": "Software Developer",
                "department": "Engineering",
                "phone": "+1 555-123-4567",
                "bio": "Full-stack developer with 5 years of experience.",
                "start_date": "2020-01-15",
                "photo_url": "https://example.com/photos/john-doe.jpg",
                "manager_id": "5f8d0d55b54764421b71cc2c",
                "manager_name": "Jane Smith",
                "skills": ["Python", "React", "MongoDB"],
                "created_at": "2023-01-01",
                "updated_at": "2023-10-01"
            }
        } 