from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_demo_users():
    try:
        # MongoDB connection
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        db = client.hr_pulse
        
        # Demo users data
        demo_users = [
            {
                "username": "admin@example.com",
                "email": "admin@example.com",
                "full_name": "Admin User",
                "hashed_password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                "is_active": True,
                "role": "admin"
            },
            {
                "username": "user@example.com",
                "email": "user@example.com",
                "full_name": "Regular User",
                "hashed_password": bcrypt.hashpw("user123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                "is_active": True,
                "role": "user"
            }
        ]
        
        # Clear existing users (optional)
        await db.users.delete_many({})
        logger.info("Cleared existing users")
        
        # Insert demo users
        for user in demo_users:
            result = await db.users.insert_one(user)
            logger.info(f"Created user: {user['username']} with ID: {result.inserted_id}")
        
        logger.info("Demo users created successfully")
        
    except Exception as e:
        logger.error(f"Error creating demo users: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_demo_users()) 