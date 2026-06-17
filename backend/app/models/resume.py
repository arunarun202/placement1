from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base

class ResumeUpload(Base):
    __tablename__ = "resume_uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(254))
    job_role = Column(String(255))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    file = Column(String(255), nullable=False)
    processed = Column(Boolean, default=False)
    ats_score = Column(Float)
    gemini_response = Column(JSONB)
    suggestions = Column(Text)
    course_products = Column(JSONB)
    alternative_roles = Column(JSONB)
    role_courses = Column(JSONB)

    user = relationship("User", back_populates="resume_uploads")
