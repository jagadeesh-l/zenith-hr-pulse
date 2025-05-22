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
        "email": "admin@example.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxQxJxJxJx",  # Password: admin123
        "name": "Admin User",
        "role": "admin"
    },
    "user@example.com": {
        "email": "user@example.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxQxJxJxJx",  # Password: user123
        "name": "Regular User",
        "role": "user"
    }
} 