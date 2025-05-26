from fastapi import UploadFile, HTTPException
import shutil
import os
from pathlib import Path
import uuid

class ImageUploadService:
    UPLOAD_DIR = Path("uploads/photos")
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    @classmethod
    async def upload_photo(cls, file: UploadFile) -> str:
        """Upload a photo and return its URL path"""
        try:
            # Create upload directory if it doesn't exist
            cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

            # Validate file extension
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in cls.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail="File type not allowed. Use JPG, PNG or GIF"
                )

            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = cls.UPLOAD_DIR / unique_filename

            # Save the file
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            return f"/uploads/photos/{unique_filename}"

        except HTTPException as he:
            raise he
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}"
            )
