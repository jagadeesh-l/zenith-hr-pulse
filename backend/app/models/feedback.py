from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class FeedbackBase(BaseModel):
    fromEmployeeId: str
    toEmployeeId: str
    title: str
    description: Optional[str] = None
    percent: float = 0.0
    category: str  # communication, leadership, client_feedback
    status: str = "pending"  # pending, responded, read
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    percent: Optional[float] = None
    category: Optional[str] = None
    status: Optional[str] = None
    updated_at: Optional[datetime] = None

class FeedbackInDB(FeedbackBase):
    id: str
    created_at: datetime
    updated_at: datetime 