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
        
        # Clear existing users
        await db.users.delete_many({})
        logger.info("Cleared existing users")
        
        # Create admin user
        admin_password = "admin123"
        admin_salt = bcrypt.gensalt()
        admin_hashed = bcrypt.hashpw(admin_password.encode('utf-8'), admin_salt)
        
        admin_user = {
            "username": "admin@example.com",
            "email": "admin@example.com",
            "full_name": "Admin User",
            "hashed_password": admin_hashed.decode('utf-8'),
            "is_active": True,
            "role": "admin"
        }
        
        # Create regular user
        user_password = "user123"
        user_salt = bcrypt.gensalt()
        user_hashed = bcrypt.hashpw(user_password.encode('utf-8'), user_salt)
        
        regular_user = {
            "username": "user@example.com",
            "email": "user@example.com",
            "full_name": "Regular User",
            "hashed_password": user_hashed.decode('utf-8'),
            "is_active": True,
            "role": "user"
        }
        
        # Insert users
        await db.users.insert_one(admin_user)
        await db.users.insert_one(regular_user)
        
        logger.info("Demo users created successfully")
        
        # Verify users were created
        users = await db.users.find().to_list(length=100)
        logger.info(f"Found {len(users)} users in database")
        for user in users:
            logger.info(f"Created user: {user['username']}")
            
    except Exception as e:
        logger.error(f"Error creating demo users: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_demo_users()) 