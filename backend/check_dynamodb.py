#!/usr/bin/env python3
"""
Check DynamoDB table for employee data
"""

import asyncio
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

async def check_dynamodb_table():
    """Check if DynamoDB table exists and has data"""
    try:
        # Initialize DynamoDB
        session = boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        
        dynamodb = session.resource('dynamodb')
        table_name = os.getenv('DYNAMODB_TABLE_EMPLOYEES', 'zenith-hr-employees')
        
        print(f"Checking DynamoDB table: {table_name}")
        
        # Check if table exists
        try:
            table = dynamodb.Table(table_name)
            table.load()
            print(f"✅ Table {table_name} exists")
        except Exception as e:
            print(f"❌ Table {table_name} does not exist or is not accessible: {e}")
            return
        
        # Scan table to get count
        try:
            response = table.scan(Select='COUNT')
            count = response.get('Count', 0)
            print(f"📊 Total items in table: {count}")
            
            if count > 0:
                # Get a few sample items
                sample_response = table.scan(Limit=3)
                items = sample_response.get('Items', [])
                print(f"📋 Sample items:")
                for i, item in enumerate(items):
                    print(f"  {i+1}. ID: {item.get('id', 'N/A')}, Name: {item.get('name', 'N/A')}")
            else:
                print("⚠️  Table is empty")
                
        except Exception as e:
            print(f"❌ Error scanning table: {e}")
            
    except Exception as e:
        print(f"❌ Error initializing DynamoDB: {e}")

if __name__ == "__main__":
    asyncio.run(check_dynamodb_table())
