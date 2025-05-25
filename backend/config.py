from pydantic import BaseModel

class Settings(BaseModel):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "hr_pulse"
    secret_key: str = "your-secret-key"  # Change this to a secure secret key
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

settings = Settings() 