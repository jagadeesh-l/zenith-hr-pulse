#!/usr/bin/env python3
"""
Simple script to set S3 bucket policy using boto3
"""

import boto3
import json
from botocore.exceptions import ClientError

def set_bucket_policy():
    """Set bucket policy for public read access"""
    bucket_name = "zenith-hr-pulse-photos"
    region = "us-east-1"
    
    try:
        # Create S3 client
        s3_client = boto3.client('s3', region_name=region)
        
        # Define the bucket policy
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
        
        # Apply the bucket policy
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        
        print(f"✅ Bucket policy set successfully for {bucket_name}")
        print("Photos should now be publicly accessible")
        
        # Test with an existing object
        test_key = "profile-photos/Product/68615b3571037df67b58c057/63bbb5b8-c559-4997-b348-d620040d8616.png"
        test_url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{test_key}"
        print(f"Test URL: {test_url}")
        
        return True
        
    except ClientError as e:
        print(f"❌ Error setting bucket policy: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    set_bucket_policy()
