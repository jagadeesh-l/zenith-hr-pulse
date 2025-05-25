from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"

class UserInDB(UserBase):
    hashed_password: str
    _id: Optional[str] = None

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None

class User(UserBase):
    id: str

    class Config:
        from_attributes = True 