from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_database():
    try:
        # MongoDB connection
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        db = client.hr_pulse
        
        # Test connection
        await db.command("ping")
        logger.info("Successfully connected to MongoDB")
        
        # Check users collection
        users = await db.users.find().to_list(length=100)
        logger.info(f"Found {len(users)} users in database")
        
        # Print user details (excluding passwords)
        for user in users:
            user_info = {
                "username": user.get("username"),
                "email": user.get("email"),
                "full_name": user.get("full_name"),
                "is_active": user.get("is_active", True)
            }
            logger.info(f"User: {user_info}")
            
    except Exception as e:
        logger.error(f"Error verifying database: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(verify_database()) 