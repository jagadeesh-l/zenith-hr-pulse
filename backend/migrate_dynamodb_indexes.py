#!/usr/bin/env python3
"""
DynamoDB Index Migration Script

This script migrates the existing employees table to include optimized indexes
for better query performance.

Usage:
    python migrate_dynamodb_indexes.py
"""

import asyncio
import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv

load_dotenv()

class DynamoDBIndexMigrator:
    def __init__(self):
        self.dynamodb = None
        self.table_name = "zenith-hr-employees"
        
    async def __aenter__(self):
        # Initialize DynamoDB
        session = boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        
        self.dynamodb = session.resource('dynamodb')
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass
    
    def get_new_indexes(self):
        """Get the new indexes to add to the table"""
        return [
            {
                "IndexName": "LocationIndex",
                "KeySchema": [
                    {"AttributeName": "location", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "StatusIndex",
                "KeySchema": [
                    {"AttributeName": "employee_status", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "CategoryIndex",
                "KeySchema": [
                    {"AttributeName": "employment_category", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "LeaderIndex",
                "KeySchema": [
                    {"AttributeName": "is_leader", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "PositionIndex",
                "KeySchema": [
                    {"AttributeName": "position", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "GenderIndex",
                "KeySchema": [
                    {"AttributeName": "gender", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "AccountIndex",
                "KeySchema": [
                    {"AttributeName": "account", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 5}
            },
            {
                "IndexName": "CreatedAtIndex",
                "KeySchema": [
                    {"AttributeName": "created_at", "KeyType": "HASH"}
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
            }
        ]
    
    async def get_existing_indexes(self):
        """Get existing indexes from the table"""
        try:
            table = self.dynamodb.Table(self.table_name)
            response = table.describe_table()
            return response['Table'].get('GlobalSecondaryIndexes', [])
        except ClientError as e:
            print(f"Error getting existing indexes: {e}")
            return []
    
    async def add_indexes(self):
        """Add new indexes to the table"""
        table = self.dynamodb.Table(self.table_name)
        
        # Get existing indexes
        existing_indexes = await self.get_existing_indexes()
        existing_index_names = [idx['IndexName'] for idx in existing_indexes]
        
        # Get new indexes to add
        new_indexes = self.get_new_indexes()
        
        # Filter out indexes that already exist
        indexes_to_add = [idx for idx in new_indexes if idx['IndexName'] not in existing_index_names]
        
        if not indexes_to_add:
            print("All indexes already exist. No migration needed.")
            return
        
        print(f"Adding {len(indexes_to_add)} new indexes...")
        
        try:
            # Add indexes one by one to avoid overwhelming the table
            for index in indexes_to_add:
                print(f"Adding index: {index['IndexName']}")
                
                # Add the index
                table.update(
                    AttributeDefinitions=[
                        {"AttributeName": "id", "AttributeType": "S"},
                        {"AttributeName": "department", "AttributeType": "S"},
                        {"AttributeName": "email", "AttributeType": "S"},
                        {"AttributeName": "location", "AttributeType": "S"},
                        {"AttributeName": "employee_status", "AttributeType": "S"},
                        {"AttributeName": "employment_category", "AttributeType": "S"},
                        {"AttributeName": "is_leader", "AttributeType": "S"},
                        {"AttributeName": "position", "AttributeType": "S"},
                        {"AttributeName": "gender", "AttributeType": "S"},
                        {"AttributeName": "account", "AttributeType": "S"},
                        {"AttributeName": "created_at", "AttributeType": "S"}
                    ],
                    GlobalSecondaryIndexUpdates=[
                        {
                            "Create": index
                        }
                    ]
                )
                
                # Wait for the index to be created
                print(f"Waiting for index {index['IndexName']} to be created...")
                waiter = self.dynamodb.meta.client.get_waiter('table_exists')
                waiter.wait(
                    TableName=self.table_name,
                    WaiterConfig={
                        'Delay': 10,
                        'MaxAttempts': 30
                    }
                )
                
                print(f"Index {index['IndexName']} created successfully!")
                
        except ClientError as e:
            print(f"Error adding indexes: {e}")
            raise
    
    async def update_table_throughput(self):
        """Update table throughput for better performance"""
        table = self.dynamodb.Table(self.table_name)
        
        try:
            print("Updating table throughput...")
            table.update(
                ProvisionedThroughput={
                    'ReadCapacityUnits': 20,
                    'WriteCapacityUnits': 10
                }
            )
            print("Table throughput updated successfully!")
        except ClientError as e:
            print(f"Error updating throughput: {e}")
    
    async def migrate(self):
        """Run the complete migration"""
        print("Starting DynamoDB index migration...")
        
        try:
            # Check if table exists
            table = self.dynamodb.Table(self.table_name)
            table.load()
            print(f"Table {self.table_name} found.")
            
            # Add new indexes
            await self.add_indexes()
            
            # Update throughput
            await self.update_table_throughput()
            
            print("Migration completed successfully!")
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                print(f"Table {self.table_name} not found. Please create it first.")
            else:
                print(f"Error during migration: {e}")
            raise

async def main():
    """Main function"""
    async with DynamoDBIndexMigrator() as migrator:
        await migrator.migrate()

if __name__ == "__main__":
    asyncio.run(main())
