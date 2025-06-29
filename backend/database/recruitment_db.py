from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from typing import Optional
from backend.app.config import config

class RecruitmentDatabase:
    client: Optional[AsyncIOMotorClient] = None
    database = None

    @classmethod
    async def connect_to_database(cls):
        """Create database connection."""
        # Use config.yaml or env for recruitment DB
        recruitment_mongo_url = os.getenv("RECRUITMENT_MONGODB_URL", config.get("database.uri", "mongodb://localhost:27017"))
        recruitment_db_name = config.get("database.name", "hr_pulse_db")
        cls.client = AsyncIOMotorClient(recruitment_mongo_url)
        cls.database = cls.client[recruitment_db_name]
        print(f"Connected to recruitment database: {recruitment_db_name} @ {recruitment_mongo_url}")

    @classmethod
    async def close_database_connection(cls):
        """Close database connection."""
        if cls.client:
            cls.client.close()
            print("Recruitment database connection closed.")

    @classmethod
    def get_collection(cls, collection_name: str):
        """Get collection from recruitment database."""
        return cls.database[collection_name]

# Initialize recruitment database
recruitment_db = RecruitmentDatabase()

async def get_recruitment_database():
    """Get recruitment database instance."""
    return recruitment_db.database

async def get_recruitment_collection(collection_name: str):
    """Get collection from recruitment database."""
    return recruitment_db.get_collection(collection_name) 