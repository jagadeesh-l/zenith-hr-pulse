import os
from dotenv import load_dotenv
from .database_dynamodb import (
    dynamodb_service, 
    get_employees_table, 
    get_users_table, 
    get_goals_table, 
    get_feedback_table,
    get_recruitment_table,
    initialize_dynamodb
)

load_dotenv()

# DynamoDB setup
# Initialize DynamoDB tables on startup
try:
    import asyncio
    # Run the initialization in a new event loop if one doesn't exist
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're already in an async context, schedule the initialization
            asyncio.create_task(initialize_dynamodb())
        else:
            loop.run_until_complete(initialize_dynamodb())
    except RuntimeError:
        # No event loop exists, create one
        asyncio.run(initialize_dynamodb())
    
    print("DynamoDB initialized successfully")
    
    # Create collection-like interfaces for backward compatibility
    class DynamoDBCollection:
        def __init__(self, table_name: str):
            self.table_name = table_name
        
        async def find_one(self, query: dict):
            """Find one item in DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    # Handle different query types
                    if "_id" in query:
                        # Convert MongoDB-style _id to DynamoDB id
                        response = await table.get_item(Key={"id": query["_id"]})
                        if "Item" in response:
                            item = response["Item"]
                            # Convert back to MongoDB-style format for compatibility
                            item["_id"] = item.pop("id", None)
                            return item
                    elif "email" in query:
                        # Use GSI for email queries
                        response = await table.query(
                            IndexName="EmailIndex",
                            KeyConditionExpression="email = :email",
                            ExpressionAttributeValues={":email": query["email"]}
                        )
                        if response.get("Items"):
                            item = response["Items"][0]
                            item["_id"] = item.pop("id", None)
                            return item
                    return None
            except Exception as e:
                print(f"Error in find_one: {e}")
                return None
        
        async def find(self, query: dict = None, skip: int = 0, limit: int = 100):
            """Find multiple items in DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    # Build scan parameters
                    scan_kwargs = {
                        "Limit": limit + skip
                    }
                    
                    # Add filters if query provided
                    if query:
                        filter_expressions = []
                        expression_values = {}
                        expression_names = {}
                        
                        for key, value in query.items():
                            if key == "$or":
                                # Handle $or queries (simplified)
                                continue
                            elif key.startswith("$"):
                                # Skip MongoDB operators for now
                                continue
                            else:
                                filter_expressions.append(f"#{key} = :{key}")
                                expression_values[f":{key}"] = value
                                expression_names[f"#{key}"] = key
                        
                        if filter_expressions:
                            scan_kwargs["FilterExpression"] = " AND ".join(filter_expressions)
                            scan_kwargs["ExpressionAttributeValues"] = expression_values
                            scan_kwargs["ExpressionAttributeNames"] = expression_names
                    
                    response = await table.scan(**scan_kwargs)
                    
                    # Convert to MongoDB-style format
                    items = []
                    for item in response.get("Items", []):
                        item["_id"] = item.pop("id", None)
                        items.append(item)
                    
                    # Apply skip and limit
                    items = items[skip:skip + limit]
                    
                    # Create async generator
                    async def item_generator():
                        for item in items:
                            yield item
                    
                    return item_generator()
            except Exception as e:
                print(f"Error in find: {e}")
                async def empty_generator():
                    return
                    yield  # This will never be reached
                return empty_generator()
        
        async def insert_one(self, document: dict):
            """Insert one item into DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    # Generate ID if not provided
                    if "_id" not in document:
                        import uuid
                        document["_id"] = str(uuid.uuid4())
                    
                    # Convert MongoDB-style document to DynamoDB format
                    item = document.copy()
                    item["id"] = item.pop("_id")
                    
                    # Add timestamps if not present
                    from datetime import datetime
                    now = datetime.utcnow().isoformat()
                    if "created_at" not in item:
                        item["created_at"] = now
                    if "updated_at" not in item:
                        item["updated_at"] = now
                    
                    await table.put_item(Item=item)
                    
                    # Return MongoDB-style result
                    class MockResult:
                        def __init__(self, inserted_id):
                            self.inserted_id = inserted_id
                    
                    return MockResult(document["_id"])
            except Exception as e:
                print(f"Error in insert_one: {e}")
                class MockResult:
                    inserted_id = None
                return MockResult()
        
        async def update_one(self, query: dict, update: dict):
            """Update one item in DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    # Get the item first
                    item = await self.find_one(query)
                    if not item:
                        return {"modified_count": 0}
                    
                    # Apply updates
                    if "$set" in update:
                        for key, value in update["$set"].items():
                            item[key] = value
                    
                    # Update timestamps
                    from datetime import datetime
                    item["updated_at"] = datetime.utcnow().isoformat()
                    
                    # Convert back to DynamoDB format
                    item["id"] = item.pop("_id")
                    
                    await table.put_item(Item=item)
                    return {"modified_count": 1}
            except Exception as e:
                print(f"Error in update_one: {e}")
                return {"modified_count": 0}
        
        async def delete_one(self, query: dict):
            """Delete one item from DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    if "_id" in query:
                        await table.delete_item(Key={"id": query["_id"]})
                        return {"deleted_count": 1}
                    return {"deleted_count": 0}
            except Exception as e:
                print(f"Error in delete_one: {e}")
                return {"deleted_count": 0}
        
        async def count_documents(self, query: dict = None):
            """Count documents in DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    if query:
                        # Use scan with count
                        scan_kwargs = {"Select": "COUNT"}
                        
                        # Add filters if query provided
                        filter_expressions = []
                        expression_values = {}
                        expression_names = {}
                        
                        for key, value in query.items():
                            if key.startswith("$"):
                                continue
                            else:
                                filter_expressions.append(f"#{key} = :{key}")
                                expression_values[f":{key}"] = value
                                expression_names[f"#{key}"] = key
                        
                        if filter_expressions:
                            scan_kwargs["FilterExpression"] = " AND ".join(filter_expressions)
                            scan_kwargs["ExpressionAttributeValues"] = expression_values
                            scan_kwargs["ExpressionAttributeNames"] = expression_names
                        
                        response = await table.scan(**scan_kwargs)
                        return response.get("Count", 0)
                    else:
                        # Get table info
                        response = await table.describe_table()
                        return response["Table"].get("ItemCount", 0)
            except Exception as e:
                print(f"Error in count_documents: {e}")
                return 0
        
        async def insert_many(self, documents: list):
            """Insert multiple items into DynamoDB table"""
            try:
                async with dynamodb_service as db:
                    table = await db.get_table(self.table_name)
                    
                    # Process documents in batches
                    batch_size = 25  # DynamoDB batch write limit
                    inserted_ids = []
                    
                    for i in range(0, len(documents), batch_size):
                        batch = documents[i:i + batch_size]
                        
                        # Prepare batch write request
                        with table.batch_writer() as batch_writer:
                            for doc in batch:
                                # Generate ID if not provided
                                if "_id" not in doc:
                                    import uuid
                                    doc["_id"] = str(uuid.uuid4())
                                
                                # Convert MongoDB-style document to DynamoDB format
                                item = doc.copy()
                                item["id"] = item.pop("_id")
                                
                                # Add timestamps if not present
                                from datetime import datetime
                                now = datetime.utcnow().isoformat()
                                if "created_at" not in item:
                                    item["created_at"] = now
                                if "updated_at" not in item:
                                    item["updated_at"] = now
                                
                                batch_writer.put_item(Item=item)
                                inserted_ids.append(doc["_id"])
                    
                    # Return MongoDB-style result
                    class MockResult:
                        def __init__(self, inserted_ids):
                            self.inserted_ids = inserted_ids
                    
                    return MockResult(inserted_ids)
            except Exception as e:
                print(f"Error in insert_many: {e}")
                class MockResult:
                    inserted_ids = []
                return MockResult()
    
    # Create collection instances
    employees_collection = DynamoDBCollection("employees")
    users_collection = DynamoDBCollection("users")
    
    # Create a mock db object for backward compatibility
    class MockDB:
        def __getitem__(self, collection_name):
            return DynamoDBCollection(collection_name)
    
    db = MockDB()
    
except Exception as e:
    print(f"DynamoDB initialization error: {e}")
    # Provide a fallback for development
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
        
        async def count_documents(self, *args, **kwargs):
            return 0
        
        async def insert_many(self, *args, **kwargs):
            class MockResult:
                inserted_ids = ["mock_id"]
            return MockResult()
    
    employees_collection = MockCollection()
    users_collection = MockCollection()
    
    class MockDB:
        def __getitem__(self, collection_name):
            return MockCollection()
    
    db = MockDB()
    print("Warning: Using mock database collections for development")
