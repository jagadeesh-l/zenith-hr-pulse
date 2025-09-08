from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class GoalBase(BaseModel):
    employeeId: str
    title: str
    description: Optional[str] = None
    category: str  # communication, leadership, client_feedback
    completion: float = 0.0  # percentage
    attachment_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    completion: Optional[float] = None
    attachment_url: Optional[str] = None
    updated_at: Optional[datetime] = None

class GoalInDB(GoalBase):
    id: str
    created_at: datetime
    updated_at: datetime 