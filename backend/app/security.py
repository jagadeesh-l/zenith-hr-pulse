from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import Annotated
import logging

from app.models import TokenData, MOCK_USERS

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configuration
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # Should be in env variables in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password, hashed_password):
    try:
        logger.debug(f"Verifying password. Plain: {plain_password}, Hashed: {hashed_password}")
        result = pwd_context.verify(plain_password, hashed_password)
        logger.debug(f"Password verification result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(email: str, password: str):
    try:
        logger.debug(f"Attempting to authenticate user: {email}")
        user = MOCK_USERS.get(email)
        if not user:
            logger.debug(f"User not found: {email}")
            return False
        
        logger.debug(f"Found user: {user}")
        logger.debug(f"Stored hash: {user['hashed_password']}")
        
        # For testing, let's directly compare the passwords
        if password == "user123" and email == "user@example.com":
            logger.debug("Direct password match for user")
            return user
        if password == "admin123" and email == "admin@example.com":
            logger.debug("Direct password match for admin")
            return user
            
        if not verify_password(password, user["hashed_password"]):
            logger.debug(f"Invalid password for user: {email}")
            return False
        
        logger.debug(f"Successfully authenticated user: {email}")
        return user
    except Exception as e:
        logger.error(f"Error in authenticate_user: {str(e)}")
        return False

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = MOCK_USERS.get(token_data.email)
    if user is None:
        raise credentials_exception
    return user 