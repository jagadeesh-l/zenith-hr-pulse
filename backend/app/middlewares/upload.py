from fastapi import HTTPException
from typing import List
import magic

class UploadMiddleware:
    ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/gif'
    ]
    
    @staticmethod
    def validate_file_type(content: bytes) -> bool:
        """Validate file type using magic numbers"""
        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(content)
        return file_type in UploadMiddleware.ALLOWED_MIMES
    
    @staticmethod
    async def validate_upload(file_content: bytes, filename: str):
        """Validate file upload"""
        if not UploadMiddleware.validate_file_type(file_content):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG and GIF images are allowed."
            )
