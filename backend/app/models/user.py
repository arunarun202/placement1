from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(128), nullable=False)
    email = Column(String(254), unique=True, index=True, nullable=True)
    first_name = Column(String(150), default="")
    last_name = Column(String(150), default="")
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    date_joined = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("UserPredictModel", back_populates="user", cascade="all, delete-orphan")
    resume_uploads = relationship("ResumeUpload", back_populates="user", cascade="all, delete-orphan")
