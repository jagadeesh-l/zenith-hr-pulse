#!/usr/bin/env python3
"""
Test script to debug the API issue
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database_dynamodb import get_employees_table, parse_dynamodb_item

async def test_dynamodb():
    """Test DynamoDB connection and data retrieval"""
    try:
        print("Testing DynamoDB connection...")
        
        # Get table
        table = await get_employees_table()
        print(f"✅ Table obtained: {table}")
        
        # Scan table
        print("Scanning table...")
        response = await table.scan(Limit=5)
        items = response.get("Items", [])
        print(f"✅ Scan returned {len(items)} items")
        
        if items:
            print("Sample item:")
            print(items[0])
            
            # Parse item
            parsed = parse_dynamodb_item(items[0])
            print("Parsed item:")
            print(parsed)
        else:
            print("❌ No items found in table")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_dynamodb())
