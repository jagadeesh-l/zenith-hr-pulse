#!/usr/bin/env python3
"""
Test script to verify presigned URL generation
"""

import asyncio
import os
import sys

# Add the current directory to Python path
sys.path.append('.')

async def test_presigned_url():
    """Test presigned URL generation"""
    try:
        # Import after adding path
        from app.services.s3_service import s3_service
        
        # Test generating a presigned URL for an existing object
        test_key = "profile-photos/Product/68615b3571037df67b58c057/63bbb5b8-c559-4997-b348-d620040d8616.png"
        
        print(f"Testing presigned URL generation for key: {test_key}")
        
        # Generate presigned URL
        presigned_url = await s3_service.get_photo_url(test_key)
        print(f"Generated presigned URL: {presigned_url}")
        
        # Test if the URL is accessible
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.head(presigned_url) as response:
                print(f"URL accessibility test: {response.status}")
                if response.status == 200:
                    print("✅ Presigned URL is accessible!")
                else:
                    print(f"❌ Presigned URL returned status: {response.status}")
                    
    except Exception as e:
        print(f"Error testing presigned URL: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_presigned_url())
