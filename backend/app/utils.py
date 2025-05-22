from bson import ObjectId
from pydantic import BaseModel

class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)
        return v
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

def validate_object_id(id_str: str) -> bool:
    """Validate if a string is a valid ObjectId"""
    return ObjectId.is_valid(id_str) 