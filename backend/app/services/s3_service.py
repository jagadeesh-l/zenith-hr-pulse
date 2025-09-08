import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException
import aioboto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

class S3Service:
    """S3 service for handling file uploads and storage"""
    
    def __init__(self):
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "zenith-hr-pulse-photos")
        self.region = os.getenv("S3_BUCKET_REGION", "us-east-1")
        self.photos_prefix = os.getenv("S3_PHOTOS_PREFIX", "profile-photos/")
        self.allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        self.max_file_size = 5 * 1024 * 1024  # 5MB
    
    async def upload_photo(self, file: UploadFile, employee_id: str = None, location: str = None, department: str = None) -> str:
        """Upload a photo to S3 with partition-based organization and return its URL"""
        try:
            # Validate file extension
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in self.allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail="File type not allowed. Use JPG, PNG, GIF, or WEBP"
                )
            
            # Validate file size
            file_content = await file.read()
            if len(file_content) > self.max_file_size:
                raise HTTPException(
                    status_code=400,
                    detail="File size too large. Maximum size is 5MB"
                )
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            
            # Create partition-based S3 key structure: location/department/employee_id/filename
            if location and department and employee_id:
                s3_key = f"{self.photos_prefix}{location}/{department}/{employee_id}/{unique_filename}"
            elif department and employee_id:
                s3_key = f"{self.photos_prefix}{department}/{employee_id}/{unique_filename}"
            elif employee_id:
                s3_key = f"{self.photos_prefix}{employee_id}/{unique_filename}"
            else:
                s3_key = f"{self.photos_prefix}{unique_filename}"
            
            # Upload to S3
            session = aioboto3.Session()
            async with session.client('s3', region_name=self.region) as s3:
                await s3.put_object(
                    Bucket=self.bucket_name,
                    Key=s3_key,
                    Body=file_content,
                    ContentType=file.content_type or 'image/jpeg',
                    ACL='public-read'  # Make the file publicly accessible
                )
            
            # Return the public URL
            photo_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{s3_key}"
            return photo_url
            
        except HTTPException as he:
            raise he
        except ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload to S3: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}"
            )
    
    async def delete_photo(self, photo_url: str) -> bool:
        """Delete a photo from S3"""
        try:
            # Extract S3 key from URL
            if not photo_url.startswith(f"https://{self.bucket_name}.s3."):
                return False
            
            # Extract the key from the URL
            s3_key = photo_url.split(f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/")[-1]
            
            session = aioboto3.Session()
            async with session.client('s3', region_name=self.region) as s3:
                await s3.delete_object(Bucket=self.bucket_name, Key=s3_key)
            
            return True
            
        except ClientError as e:
            print(f"Error deleting photo from S3: {e}")
            return False
        except Exception as e:
            print(f"Error deleting photo: {e}")
            return False
    
    async def get_photo_url(self, s3_key: str) -> str:
        """Get the public URL for an S3 object"""
        return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{s3_key}"
    
    async def list_photos(self, prefix: Optional[str] = None) -> list:
        """List all photos in the S3 bucket"""
        try:
            search_prefix = prefix or self.photos_prefix
            
            session = aioboto3.Session()
            async with session.client('s3', region_name=self.region) as s3:
                response = await s3.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=search_prefix
                )
                
                photos = []
                if 'Contents' in response:
                    for obj in response['Contents']:
                        photos.append({
                            'key': obj['Key'],
                            'url': await self.get_photo_url(obj['Key']),
                            'size': obj['Size'],
                            'last_modified': obj['LastModified']
                        })
                
                return photos
                
        except ClientError as e:
            print(f"Error listing photos from S3: {e}")
            return []
        except Exception as e:
            print(f"Error listing photos: {e}")
            return []
    
    async def get_employee_photos(self, employee_id: str, location: str = None, department: str = None) -> list:
        """Get all photos for a specific employee"""
        try:
            # Build search prefix based on partition structure
            if location and department:
                search_prefix = f"{self.photos_prefix}{location}/{department}/{employee_id}/"
            elif department:
                search_prefix = f"{self.photos_prefix}{department}/{employee_id}/"
            else:
                search_prefix = f"{self.photos_prefix}{employee_id}/"
            
            session = aioboto3.Session()
            async with session.client('s3', region_name=self.region) as s3:
                response = await s3.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=search_prefix
                )
                
                photos = []
                if 'Contents' in response:
                    for obj in response['Contents']:
                        photos.append({
                            'key': obj['Key'],
                            'url': await self.get_photo_url(obj['Key']),
                            'size': obj['Size'],
                            'last_modified': obj['LastModified']
                        })
                
                return photos
                
        except ClientError as e:
            print(f"Error getting employee photos from S3: {e}")
            return []
        except Exception as e:
            print(f"Error getting employee photos: {e}")
            return []
    
    async def get_employee_photo_url(self, employee_id: str, location: str = None, department: str = None) -> Optional[str]:
        """Get the primary photo URL for an employee (first photo found)"""
        try:
            photos = await self.get_employee_photos(employee_id, location, department)
            if photos:
                return photos[0]['url']
            return None
        except Exception as e:
            print(f"Error getting employee photo URL: {e}")
            return None
    
    async def create_bucket_if_not_exists(self) -> bool:
        """Create S3 bucket if it doesn't exist"""
        try:
            session = aioboto3.Session()
            async with session.client('s3', region_name=self.region) as s3:
                # Check if bucket exists
                try:
                    await s3.head_bucket(Bucket=self.bucket_name)
                    print(f"S3 bucket {self.bucket_name} already exists")
                    return True
                except ClientError as e:
                    if e.response['Error']['Code'] == '404':
                        # Bucket doesn't exist, create it
                        if self.region == 'us-east-1':
                            # us-east-1 doesn't need LocationConstraint
                            await s3.create_bucket(Bucket=self.bucket_name)
                        else:
                            await s3.create_bucket(
                                Bucket=self.bucket_name,
                                CreateBucketConfiguration={'LocationConstraint': self.region}
                            )
                        print(f"S3 bucket {self.bucket_name} created successfully")
                        return True
                    else:
                        print(f"Error checking S3 bucket: {e}")
                        return False
                        
        except Exception as e:
            print(f"Error creating S3 bucket: {e}")
            return False

# Global S3 service instance
s3_service = S3Service()

# Initialize S3 bucket on startup
async def initialize_s3():
    """Initialize S3 bucket"""
    try:
        await s3_service.create_bucket_if_not_exists()
        print("S3 initialization completed successfully")
    except Exception as e:
        print(f"S3 initialization failed: {e}")
        print("File uploads will not work until S3 is properly configured")
