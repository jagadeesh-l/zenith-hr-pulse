from fastapi import APIRouter, HTTPException, status
from typing import List
from models.user import User, UserCreate, UserUpdate
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

router = APIRouter()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.hr_pulse

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/", response_model=List[User])
async def get_users():
    users = await db.users.find().to_list(length=100)
    return users

@router.get("/{username}", response_model=User)
async def get_user(username: str):
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    # Check if user already exists
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    user_dict = user.dict()
    user_dict["hashed_password"] = pwd_context.hash(user.password)
    del user_dict["password"]
    
    result = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return created_user

@router.put("/{username}", response_model=User)
async def update_user(username: str, user: UserUpdate):
    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = pwd_context.hash(update_data.pop("password"))
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.users.update_one(
        {"username": username},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"username": username})
    return updated_user

@router.delete("/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(username: str):
    result = await db.users.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found") 