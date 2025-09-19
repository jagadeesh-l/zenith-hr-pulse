#!/usr/bin/env python3
"""
Test the backend API directly
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routers.employees import get_employees

async def test_api():
    """Test the API function directly"""
    try:
        print("Testing get_employees function...")
        
        # Call the function directly
        result = await get_employees()
        print(f"✅ Function returned: {len(result)} employees")
        
        if result:
            print("Sample employee:")
            print(result[0])
        else:
            print("❌ No employees returned")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_api())
