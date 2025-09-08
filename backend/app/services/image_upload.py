from fastapi import UploadFile, HTTPException
from typing import Optional
from .s3_service import s3_service

class ImageUploadService:
    """Image upload service using AWS S3 with partition-based organization"""
    
    @classmethod
    async def upload_photo(cls, file: UploadFile, employee_id: str = None, location: str = None, department: str = None) -> str:
        """Upload a photo to S3 with partition-based organization and return its URL"""
        try:
            # Use S3 service to upload the photo with partition structure
            photo_url = await s3_service.upload_photo(file, employee_id, location, department)
            return photo_url

        except HTTPException as he:
            raise he
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}"
            )
    
    @classmethod
    async def delete_photo(cls, photo_url: str) -> bool:
        """Delete a photo from S3"""
        try:
            return await s3_service.delete_photo(photo_url)
        except Exception as e:
            print(f"Error deleting photo: {e}")
            return False
    
    @classmethod
    async def get_employee_photo_url(cls, employee_id: str, location: str = None, department: str = None) -> Optional[str]:
        """Get the primary photo URL for an employee"""
        try:
            return await s3_service.get_employee_photo_url(employee_id, location, department)
        except Exception as e:
            print(f"Error getting employee photo URL: {e}")
            return None
    
    @classmethod
    async def get_employee_photos(cls, employee_id: str, location: str = None, department: str = None) -> list:
        """Get all photos for an employee"""
        try:
            return await s3_service.get_employee_photos(employee_id, location, department)
        except Exception as e:
            print(f"Error getting employee photos: {e}")
            return []
