from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from passlib.context import CryptContext
import bcrypt

# Update the CryptContext configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool = True
    is_admin: bool = False

    class Config:
        json_schema_extra = {  # Updated from schema_extra to json_schema_extra for Pydantic v2
            "example": {
                "id": "5f8d0d55b54764421b71cc2d",
                "email": "user@example.com",
                "username": "johndoe",
                "full_name": "John Doe",
                "is_active": True,
                "is_admin": False
            }
        }

# Update mock users with the correct credentials
MOCK_USERS: Dict[str, dict] = {
    "admin@example.com": {
        "id": "1",
        "username": "admin",
        "email": "admin@example.com",
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash("admin123"),
        "is_active": True,
        "is_admin": True
    },
    "user@example.com": {
        "id": "2",
        "username": "user",
        "email": "user@example.com",
        "full_name": "Regular User",
        "hashed_password": pwd_context.hash("user123"),
        "is_active": True,
        "is_admin": False
    }
}