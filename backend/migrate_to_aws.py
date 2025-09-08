#!/usr/bin/env python3
"""
Migration script to move data from MongoDB to AWS services
This script helps migrate existing data to the new AWS-based architecture
"""

import asyncio
import os
import sys
from datetime import datetime
from decimal import Decimal
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database_dynamodb import dynamodb_service, format_dynamodb_item
from app.services.s3_service import s3_service

# MongoDB imports for migration
try:
    import motor.motor_asyncio
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    MONGO_AVAILABLE = False
    print("MongoDB libraries not available. Install pymongo and motor for migration.")

load_dotenv()

class DataMigrator:
    def __init__(self):
        self.mongo_uri = os.getenv("MONGO_URI")
        self.mongo_db_name = os.getenv("MONGO_DB_NAME", "hr_pulse_db")
        self.migration_stats = {
            "employees": {"migrated": 0, "failed": 0},
            "users": {"migrated": 0, "failed": 0},
            "goals": {"migrated": 0, "failed": 0},
            "feedback": {"migrated": 0, "failed": 0}
        }
    
    def convert_floats_to_decimal(self, obj):
        """Convert float and datetime values for DynamoDB compatibility"""
        if isinstance(obj, dict):
            return {key: self.convert_floats_to_decimal(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self.convert_floats_to_decimal(item) for item in obj]
        elif isinstance(obj, float):
            return Decimal(str(obj))
        elif isinstance(obj, datetime):
            return obj.isoformat()
        else:
            return obj
    
    async def connect_mongodb(self):
        """Connect to MongoDB for data extraction"""
        if not MONGO_AVAILABLE:
            raise Exception("MongoDB libraries not available")
        
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.mongo_db_name]
            # Test connection
            client.admin.command('ping')
            print("Connected to MongoDB successfully")
            return db
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def migrate_employees(self, mongo_db):
        """Migrate employees from MongoDB to DynamoDB"""
        print("Migrating employees...")
        
        try:
            async with dynamodb_service as db:
                table = await db.get_table("employees")
                
                # Get all employees from MongoDB
                employees = list(mongo_db.employees.find())
                
                for employee in employees:
                    try:
                        # Convert MongoDB document to DynamoDB format
                        item = employee.copy()
                        
                        # Convert _id to id
                        if "_id" in item:
                            item["id"] = str(item.pop("_id"))
                        
                        # Convert floats to Decimal for DynamoDB compatibility
                        item = self.convert_floats_to_decimal(item)
                        
                        # Ensure required fields
                        if "created_at" not in item:
                            item["created_at"] = datetime.utcnow().isoformat()
                        if "updated_at" not in item:
                            item["updated_at"] = datetime.utcnow().isoformat()
                        
                        # Upload to DynamoDB
                        await table.put_item(Item=item)
                        self.migration_stats["employees"]["migrated"] += 1
                        
                    except Exception as e:
                        print(f"Failed to migrate employee {employee.get('_id', 'unknown')}: {e}")
                        self.migration_stats["employees"]["failed"] += 1
                
                print(f"Employees migration completed: {self.migration_stats['employees']['migrated']} migrated, {self.migration_stats['employees']['failed']} failed")
                
        except Exception as e:
            print(f"Error during employees migration: {e}")
    
    async def migrate_users(self, mongo_db):
        """Migrate users from MongoDB to DynamoDB"""
        print("Migrating users...")
        
        try:
            async with dynamodb_service as db:
                table = await db.get_table("users")
                
                # Get all users from MongoDB
                users = list(mongo_db.users.find())
                
                for user in users:
                    try:
                        # Convert MongoDB document to DynamoDB format
                        item = user.copy()
                        
                        # Convert _id to id
                        if "_id" in item:
                            item["id"] = str(item.pop("_id"))
                        
                        # Convert floats to Decimal for DynamoDB compatibility
                        item = self.convert_floats_to_decimal(item)
                        
                        # Ensure required fields
                        if "created_at" not in item:
                            item["created_at"] = datetime.utcnow().isoformat()
                        if "updated_at" not in item:
                            item["updated_at"] = datetime.utcnow().isoformat()
                        
                        # Upload to DynamoDB
                        await table.put_item(Item=item)
                        self.migration_stats["users"]["migrated"] += 1
                        
                    except Exception as e:
                        print(f"Failed to migrate user {user.get('_id', 'unknown')}: {e}")
                        self.migration_stats["users"]["failed"] += 1
                
                print(f"Users migration completed: {self.migration_stats['users']['migrated']} migrated, {self.migration_stats['users']['failed']} failed")
                
        except Exception as e:
            print(f"Error during users migration: {e}")
    
    async def migrate_goals(self, mongo_db):
        """Migrate goals from MongoDB to DynamoDB"""
        print("Migrating goals...")
        
        try:
            async with dynamodb_service as db:
                table = await db.get_table("goals")
                
                # Get all goals from MongoDB
                goals = list(mongo_db.goals.find())
                
                for goal in goals:
                    try:
                        # Convert MongoDB document to DynamoDB format
                        item = goal.copy()
                        
                        # Convert _id to id
                        if "_id" in item:
                            item["id"] = str(item.pop("_id"))
                        
                        # Convert floats to Decimal for DynamoDB compatibility
                        item = self.convert_floats_to_decimal(item)
                        
                        # Ensure required fields
                        if "created_at" not in item:
                            item["created_at"] = datetime.utcnow().isoformat()
                        if "updated_at" not in item:
                            item["updated_at"] = datetime.utcnow().isoformat()
                        
                        # Upload to DynamoDB
                        await table.put_item(Item=item)
                        self.migration_stats["goals"]["migrated"] += 1
                        
                    except Exception as e:
                        print(f"Failed to migrate goal {goal.get('_id', 'unknown')}: {e}")
                        self.migration_stats["goals"]["failed"] += 1
                
                print(f"Goals migration completed: {self.migration_stats['goals']['migrated']} migrated, {self.migration_stats['goals']['failed']} failed")
                
        except Exception as e:
            print(f"Error during goals migration: {e}")
    
    async def migrate_feedback(self, mongo_db):
        """Migrate feedback from MongoDB to DynamoDB"""
        print("Migrating feedback...")
        
        try:
            async with dynamodb_service as db:
                table = await db.get_table("feedback")
                
                # Get all feedback from MongoDB
                feedback = list(mongo_db.feedback.find())
                
                for fb in feedback:
                    try:
                        # Convert MongoDB document to DynamoDB format
                        item = fb.copy()
                        
                        # Convert _id to id
                        if "_id" in item:
                            item["id"] = str(item.pop("_id"))
                        
                        # Convert floats to Decimal for DynamoDB compatibility
                        item = self.convert_floats_to_decimal(item)
                        
                        # Ensure required fields
                        if "created_at" not in item:
                            item["created_at"] = datetime.utcnow().isoformat()
                        if "updated_at" not in item:
                            item["updated_at"] = datetime.utcnow().isoformat()
                        
                        # Upload to DynamoDB
                        await table.put_item(Item=item)
                        self.migration_stats["feedback"]["migrated"] += 1
                        
                    except Exception as e:
                        print(f"Failed to migrate feedback {fb.get('_id', 'unknown')}: {e}")
                        self.migration_stats["feedback"]["failed"] += 1
                
                print(f"Feedback migration completed: {self.migration_stats['feedback']['migrated']} migrated, {self.migration_stats['feedback']['failed']} failed")
                
        except Exception as e:
            print(f"Error during feedback migration: {e}")
    
    async def migrate_photos_to_s3(self):
        """Migrate local photos to S3"""
        print("Migrating photos to S3...")
        
        try:
            # Initialize S3
            await s3_service.create_bucket_if_not_exists()
            
            # Get list of local photos
            photos_dir = "uploads/photos"
            if not os.path.exists(photos_dir):
                print("No local photos directory found")
                return
            
            photos = [f for f in os.listdir(photos_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            
            migrated_count = 0
            failed_count = 0
            
            for photo_file in photos:
                try:
                    photo_path = os.path.join(photos_dir, photo_file)
                    
                    # Read the photo file
                    with open(photo_path, 'rb') as f:
                        photo_content = f.read()
                    
                    # Generate S3 key
                    file_ext = os.path.splitext(photo_file)[1]
                    s3_key = f"{s3_service.photos_prefix}{photo_file}"
                    
                    # Upload to S3
                    import aioboto3
                    async with aioboto3.Session().client('s3', region_name=s3_service.region) as s3:
                        await s3.put_object(
                            Bucket=s3_service.bucket_name,
                            Key=s3_key,
                            Body=photo_content,
                            ContentType='image/jpeg',
                            ACL='public-read'
                        )
                    
                    migrated_count += 1
                    print(f"Migrated photo: {photo_file}")
                    
                except Exception as e:
                    print(f"Failed to migrate photo {photo_file}: {e}")
                    failed_count += 1
            
            print(f"Photos migration completed: {migrated_count} migrated, {failed_count} failed")
            
        except Exception as e:
            print(f"Error during photos migration: {e}")
    
    async def run_migration(self):
        """Run the complete migration process"""
        print("Starting migration to AWS services...")
        print("=" * 50)
        
        try:
            # Connect to MongoDB
            mongo_db = await self.connect_mongodb()
            
            # Migrate data
            await self.migrate_employees(mongo_db)
            await self.migrate_users(mongo_db)
            await self.migrate_goals(mongo_db)
            await self.migrate_feedback(mongo_db)
            
            # Migrate photos to S3
            await self.migrate_photos_to_s3()
            
            # Print migration summary
            print("\n" + "=" * 50)
            print("MIGRATION SUMMARY")
            print("=" * 50)
            
            for collection, stats in self.migration_stats.items():
                print(f"{collection.capitalize()}: {stats['migrated']} migrated, {stats['failed']} failed")
            
            total_migrated = sum(stats['migrated'] for stats in self.migration_stats.values())
            total_failed = sum(stats['failed'] for stats in self.migration_stats.values())
            
            print(f"\nTotal: {total_migrated} migrated, {total_failed} failed")
            
            if total_failed == 0:
                print("\n✅ Migration completed successfully!")
            else:
                print(f"\n⚠️  Migration completed with {total_failed} failures. Please review the errors above.")
            
        except Exception as e:
            print(f"Migration failed: {e}")
            return False
        
        return True

async def main():
    """Main migration function"""
    migrator = DataMigrator()
    success = await migrator.run_migration()
    
    if success:
        print("\n🎉 Migration to AWS services completed!")
        print("\nNext steps:")
        print("1. Update your .env file with AWS credentials")
        print("2. Test the new AWS-based endpoints")
        print("3. Update your frontend to use the new photo URLs")
        print("4. Consider removing MongoDB dependencies after testing")
    else:
        print("\n❌ Migration failed. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())
