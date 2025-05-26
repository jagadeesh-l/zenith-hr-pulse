from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from models.user import User, UserInDB
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# JWT settings
SECRET_KEY = "your-secret-key"  # Change this to a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.hr_pulse

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        logger.info(f"Verifying password for user")
        result = bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
        logger.info(f"Password verification result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False

async def get_user(username: str):
    try:
        logger.info(f"Getting user: {username}")
        user_dict = await db.users.find_one({"username": username})
        if user_dict:
            logger.info(f"Found user: {username}")
            # Convert ObjectId to string for JSON serialization
            user_dict["_id"] = str(user_dict["_id"])
            return UserInDB(**user_dict)
        logger.info(f"User not found: {username}")
        return None
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        raise

async def authenticate_user(username: str, password: str):
    try:
        logger.info(f"Authenticating user: {username}")
        user = await get_user(username)
        if not user:
            logger.warning(f"User not found: {username}")
            return False
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Invalid password for user: {username}")
            return False
        logger.info(f"User authenticated successfully: {username}")
        return user
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        logger.info(f"Login attempt for user: {form_data.username}")
        
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            logger.warning(f"Failed login attempt for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        logger.info(f"Successful login for user: {form_data.username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role if hasattr(user, 'role') else 'user'
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.post("/register")
async def register(user: User):
    # Check if user already exists
    if await get_user(user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password.decode('utf-8')
    del user_dict["password"]
    
    # Insert user into database
    await db.users.insert_one(user_dict)
    
    return {"message": "User created successfully"} 