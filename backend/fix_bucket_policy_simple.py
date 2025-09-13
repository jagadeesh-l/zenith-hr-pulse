#!/usr/bin/env python3
"""
Simple script to fix S3 bucket policy using boto3
"""

import json
import boto3
from botocore.exceptions import ClientError

def fix_bucket_policy():
    """Fix S3 bucket policy to allow public read access"""
    bucket_name = "zenith-hr-pulse-photos"
    region = "us-east-1"
    
    print(f"Fixing bucket policy for {bucket_name} in region {region}")
    
    try:
        # Create S3 client
        s3_client = boto3.client('s3', region_name=region)
        
        # Check if bucket exists
        try:
            s3_client.head_bucket(Bucket=bucket_name)
            print(f"Bucket {bucket_name} exists")
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"Bucket {bucket_name} does not exist. Creating it...")
                if region == 'us-east-1':
                    s3_client.create_bucket(Bucket=bucket_name)
                else:
                    s3_client.create_bucket(
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
        
        s3_client.put_bucket_policy(
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
    fix_bucket_policy()
