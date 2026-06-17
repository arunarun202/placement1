from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base

class UserPredictModel(Base):
    __tablename__ = "user_predict_models"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    age = Column(Float, nullable=False)
    gender = Column(String(20), nullable=False)
    qualification = Column(String(50), nullable=False)
    year = Column(Float, nullable=False)
    cgpa = Column(Float, nullable=False)
    job_role = Column(String(50), nullable=False)
    post_graduation = Column(String(20), nullable=False)
    ten_percentage = Column(Float, nullable=False)
    twelth_percentage = Column(Float, nullable=False)
    salary = Column(Float, nullable=False)
    soft_skills = Column(String(50), nullable=False)
    internship = Column(String(50), nullable=False)
    experience = Column(Float, nullable=False)
    round = Column(Integer, nullable=False)
    company_name = Column(String(100), nullable=False)
    label = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="predictions")
