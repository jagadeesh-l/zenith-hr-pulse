import uuid
from pydantic import BaseModel

class PyObjectId(str):
    """Custom ID type for Pydantic models (replaces MongoDB ObjectId)"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if isinstance(v, str):
            # Validate UUID format
            try:
                uuid.UUID(v)
                return v
            except ValueError:
                raise ValueError("Invalid ID format")
        return str(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

def validate_object_id(id_str: str) -> bool:
    """Validate if a string is a valid UUID"""
    try:
        uuid.UUID(id_str)
        return True
    except ValueError:
        return False 