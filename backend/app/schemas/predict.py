from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PredictRequest(BaseModel):
    age: float
    gender: str
    qualification: str
    year: float
    cgpa: float
    job_role: str
    post_graduation: str
    ten_percentage: float
    twelth_percentage: float
    salary: float
    soft_skills: str
    internship: str
    experience: float
    round: int
    company_name: str

class PredictResponse(PredictRequest):
    id: int
    user_id: int
    label: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
