from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_users():
    try:
        # MongoDB connection
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        db = client.hr_pulse
        
        # Get all users
        users = await db.users.find().to_list(length=100)
        
        if not users:
            logger.info("No users found in database")
            return
            
        logger.info(f"Found {len(users)} users:")
        for user in users:
            logger.info(f"User: {user['username']}, Role: {user.get('role', 'user')}")
            
    except Exception as e:
        logger.error(f"Error checking users: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_users()) 