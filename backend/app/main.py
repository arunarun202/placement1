from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth, predict, resume, chat, profile

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Placement Predictor",
    version="1.0.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to specific origins like frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(predict.router, prefix="/predict", tags=["predict"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])

@app.get("/")
def root():
    return {"message": "Welcome to Placement Predictor API"}
