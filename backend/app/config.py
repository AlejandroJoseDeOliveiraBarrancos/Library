from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "firebase-credentials.json"
    
    # Google Books API
    GOOGLE_BOOKS_API_KEY: str = ""
    GOOGLE_BOOKS_API_URL: str = "https://www.googleapis.com/books/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://library_user:library_password@db:5432/library_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
