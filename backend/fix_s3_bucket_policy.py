#!/usr/bin/env python3
"""
Script to fix S3 bucket policy for public read access
Run this script to set up the bucket policy for photo uploads
"""

import asyncio
import json
import os
import aioboto3
from botocore.exceptions import ClientError

async def fix_bucket_policy():
    """Fix S3 bucket policy to allow public read access"""
    bucket_name = os.getenv("S3_BUCKET_NAME", "zenith-hr-pulse-photos")
    region = os.getenv("S3_BUCKET_REGION", "us-east-1")
    
    print(f"Fixing bucket policy for {bucket_name} in region {region}")
    
    try:
        session = aioboto3.Session()
        async with session.client('s3', region_name=region) as s3:
            # Check if bucket exists
            try:
                await s3.head_bucket(Bucket=bucket_name)
                print(f"Bucket {bucket_name} exists")
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    print(f"Bucket {bucket_name} does not exist. Creating it...")
                    if region == 'us-east-1':
                        await s3.create_bucket(Bucket=bucket_name)
                    else:
                        await s3.create_bucket(
                            Bucket=bucket_name,
                            CreateBucketConfiguration={'LocationConstraint': region}
                        )
                    print(f"Bucket {bucket_name} created successfully")
                else:
                    print(f"Error checking bucket: {e}")
                    return False
            
            # Set bucket policy for public read access
            bucket_policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicReadGetObject",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{bucket_name}/*"
                    }
                ]
            }
            
            await s3.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(bucket_policy)
            )
            print(f"✅ Bucket policy set successfully for {bucket_name}")
            print("Photos will now be publicly accessible")
            return True
            
    except Exception as e:
        print(f"❌ Error fixing bucket policy: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(fix_bucket_policy())
