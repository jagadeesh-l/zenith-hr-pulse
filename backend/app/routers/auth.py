from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Union
try:
    from typing import Annotated
except ImportError:
    # For Python < 3.9 compatibility
    from typing_extensions import Annotated
from datetime import timedelta
import logging
import traceback

from ..models import Token, UserLogin, MOCK_USERS
from ..security import (
    authenticate_user, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_active_user
)

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """Login endpoint that accepts form data"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login endpoint that accepts JSON"""
    try:
        user = authenticate_user(user_data.username, user_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.post("/msal-token", response_model=Token)
async def exchange_msal_token(msal_token: str = Body(..., embed=True)):
    """Exchange MSAL token for backend JWT token"""
    try:
        print(f"DEBUG: Received MSAL token: {msal_token[:20]}...")
        
        # For now, we'll create a token for the admin user
        # In a real implementation, you would validate the MSAL token with Microsoft
        # and extract user information from it
        
        # Create a backend token for the admin user
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": "admin@example.com"}, expires_delta=access_token_expires
        )
        print(f"DEBUG: Created backend token: {access_token[:20]}...")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error exchanging MSAL token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid MSAL token"
        )

@router.get("/me")
async def get_me(email: str = None):
    # For demo: allow public access and select user by email param
    user = None
    if email and email in MOCK_USERS:
        user = MOCK_USERS[email]
    else:
        user = MOCK_USERS["admin@example.com"]
    role = "admin" if user.get("is_admin") else "user"
    return {
        "role": role,
        "employeeId": user.get("id", "1"),
        "name": user.get("full_name", "User"),
        "email": user.get("email", "user@example.com")
    } 