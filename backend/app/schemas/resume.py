from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: Optional[str] = None
    job_role: Optional[str] = None
    uploaded_at: datetime
    file: str
    processed: bool
    ats_score: Optional[float] = None
    suggestions: Optional[str] = None
    course_products: Optional[List[str]] = None
    alternative_roles: Optional[List[str]] = None
    role_courses: Optional[List[str]] = None

    class Config:
        from_attributes = True
