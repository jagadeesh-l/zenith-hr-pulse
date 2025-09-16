from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class FeatureFlagStatus(str, Enum):
    ENABLED = "enabled"
    DISABLED = "disabled"
    HIDDEN = "hidden"

class FeatureFlagBase(BaseModel):
    name: str = Field(..., description="Unique name of the feature flag")
    display_name: str = Field(..., description="Display name for the feature flag")
    description: Optional[str] = Field(None, description="Description of what this feature flag controls")
    status: FeatureFlagStatus = Field(FeatureFlagStatus.ENABLED, description="Current status of the feature flag")
    module: str = Field(..., description="Module this feature flag belongs to (e.g., 'directory', 'performance', etc.)")
    category: str = Field(..., description="Category of the feature flag (e.g., 'hr_modules', 'admin_portal')")
    is_core_feature: bool = Field(False, description="Whether this is a core feature that cannot be hidden")
    created_by: Optional[str] = Field(None, description="User who created this feature flag")
    updated_by: Optional[str] = Field(None, description="User who last updated this feature flag")

class FeatureFlagCreate(FeatureFlagBase):
    pass

class FeatureFlagUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[FeatureFlagStatus] = None
    updated_by: Optional[str] = None

class FeatureFlagInDB(FeatureFlagBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "ff_001",
                "name": "directory_module",
                "display_name": "Directory Module",
                "description": "Controls access to the employee directory module",
                "status": "enabled",
                "module": "directory",
                "category": "hr_modules",
                "is_core_feature": False,
                "created_by": "admin",
                "updated_by": "admin",
                "created_at": "2023-01-01T00:00:00Z",
                "updated_at": "2023-01-01T00:00:00Z"
            }
        }
