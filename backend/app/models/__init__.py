from app.models.user import User
from app.models.profile import Profile
from app.models.predict import UserPredictModel
from app.models.resume import ResumeUpload
from app.models.chat import Chatbot

# For Alembic to discover all models
__all__ = [
    "User",
    "Profile",
    "UserPredictModel",
    "ResumeUpload",
    "Chatbot"
]
