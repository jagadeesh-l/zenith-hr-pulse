import motor.motor_asyncio
from .config import config

# MongoDB connection setup
mongo_uri = config.get("database.uri")
db_name = config.get("database.name")

# Create MongoDB client
mongo_client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
database = mongo_client[db_name]

# Collections
employees_collection = database[config.get("database.collections.employees")]
users_collection = database[config.get("database.collections.users")] 