from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Placement Predictor API"
    DATABASE_URL: str = ""  # Must be set via DATABASE_URL env variable / .env file
    SECRET_KEY: str = ""    # Must be set via SECRET_KEY env variable / .env file
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OPENROUTER_API_KEY: str = ""
    ENVIRONMENT: str = "production"

    class Config:
        env_file = ".env"

settings = Settings()
