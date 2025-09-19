#!/usr/bin/env python3
"""
Simple test to check if the API endpoint works
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database_dynamodb import get_employees_table, parse_dynamodb_item

async def test_simple_scan():
    """Test a simple DynamoDB scan"""
    try:
        print("Testing simple DynamoDB scan...")
        
        # Get table
        table = await get_employees_table()
        print(f"✅ Table obtained: {table}")
        
        # Simple scan without projection
        print("Performing simple scan...")
        response = await table.scan(Limit=5)
        items = response.get("Items", [])
        print(f"✅ Scan returned {len(items)} items")
        
        if items:
            print("Sample raw item:")
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
    asyncio.run(test_simple_scan())
