import motor.motor_asyncio
from .config import config

# MongoDB connection setup
# Use a default connection string that works with MongoDB Atlas or a local fallback
mongo_uri = config.get("database.uri", "mongodb://localhost:27017")
# You can also use a MongoDB Atlas connection string like:
# mongo_uri = "mongodb+srv://username:password@cluster.mongodb.net/hr_pulse_db?retryWrites=true&w=majority"

db_name = config.get("database.name", "hr_pulse_db")

# Create MongoDB client with try/except for error handling
try:
    mongo_client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    # Verify connection
    mongo_client.admin.command('ping')
    print("Connected successfully to MongoDB")
    database = mongo_client[db_name]
    
    # Collections
    employees_collection = database[config.get("database.collections.employees", "employees")]
    users_collection = database[config.get("database.collections.users", "users")]
except Exception as e:
    print(f"MongoDB connection error: {e}")
    # Provide a fallback for development
    from pymongo.collection import Collection
    class MockCollection:
        async def find_one(self, *args, **kwargs):
            return {"_id": "mock_id", "name": "Test User", "position": "Developer", "department": "IT"}
        
        async def find(self, *args, **kwargs):
            async def mock_cursor():
                yield {"_id": "mock_id", "name": "Test User", "position": "Developer", "department": "IT"}
            return mock_cursor()
        
        async def insert_one(self, *args, **kwargs):
            class MockResult:
                inserted_id = "mock_id"
            return MockResult()
        
        async def update_one(self, *args, **kwargs):
            return {"modified_count": 1}
        
        async def delete_one(self, *args, **kwargs):
            return {"deleted_count": 1}
    
    employees_collection = MockCollection()
    users_collection = MockCollection()
    print("Warning: Using mock database collections for development") 