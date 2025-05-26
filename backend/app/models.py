from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserLogin(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# Mock user database for this example
# In production, this would be a real database
MOCK_USERS = {
    "admin@example.com": {
        "username": "admin@example.com",
        "email": "admin@example.com",
        "hashed_password": "$2b$12$wzXeWbH6l4Hw8FrN8RreOewP4LJJSBCf9CxXjxAHQXGulG9H8oJbi",  # admin123
        "name": "Admin User",
        "role": "admin",
        "is_active": True
    },
    "user@example.com": {
        "username": "user@example.com",
        "email": "user@example.com",
        "hashed_password": "$2b$12$k8yOXi9F0uSezqvHfErOu.MMGVDWtxMTVCxDJ0VDTO0yEZKDM6oGO",  # user123
        "name": "Regular User",
        "role": "user",
        "is_active": True
    }
}