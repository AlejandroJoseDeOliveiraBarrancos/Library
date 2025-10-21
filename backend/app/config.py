from pydantic_settings import BaseSettings
from typing import Optional
import json


class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: Optional[str] = "firebase-credentials.json"
    
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_CLIENT_ID: Optional[str] = None
    FIREBASE_AUTH_URI: Optional[str] = "https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI: Optional[str] = "https://oauth2.googleapis.com/token"
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: Optional[str] = "https://www.googleapis.com/oauth2/v1/certs"
    FIREBASE_CLIENT_X509_CERT_URL: Optional[str] = None
    FIREBASE_UNIVERSE_DOMAIN: Optional[str] = "googleapis.com"
    
    GOOGLE_BOOKS_API_KEY: str = ""
    GOOGLE_BOOKS_API_URL: str = "https://www.googleapis.com/books/v1"
    
    DATABASE_URL: Optional[str] = "postgresql://library_user:library_password@db:5432/library_db"
    
    DB_HOST: Optional[str] = None
    DB_PORT: Optional[int] = None
    DB_NAME: Optional[str] = None
    DB_USER: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_DRIVER: str = "postgresql"
    
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        if all([self.DB_HOST, self.DB_PORT, self.DB_NAME, self.DB_USER, self.DB_PASSWORD]):
            return f"{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        
        raise ValueError("Either DATABASE_URL or all individual DB parameters (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD) must be provided")
    
    def get_firebase_credentials(self) -> dict:
        if all([
            self.FIREBASE_PROJECT_ID,
            self.FIREBASE_PRIVATE_KEY_ID,
            self.FIREBASE_PRIVATE_KEY,
            self.FIREBASE_CLIENT_EMAIL,
            self.FIREBASE_CLIENT_ID
        ]):
            return {
                "type": "service_account",
                "project_id": self.FIREBASE_PROJECT_ID,
                "private_key_id": self.FIREBASE_PRIVATE_KEY_ID,
                "private_key": self.FIREBASE_PRIVATE_KEY,
                "client_email": self.FIREBASE_CLIENT_EMAIL,
                "client_id": self.FIREBASE_CLIENT_ID,
                "auth_uri": self.FIREBASE_AUTH_URI,
                "token_uri": self.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": self.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": self.FIREBASE_CLIENT_X509_CERT_URL,
                "universe_domain": self.FIREBASE_UNIVERSE_DOMAIN
            }
        
        if self.FIREBASE_CREDENTIALS_PATH:
            import os
            if os.path.exists(self.FIREBASE_CREDENTIALS_PATH):
                with open(self.FIREBASE_CREDENTIALS_PATH, 'r') as f:
                    return json.load(f)
        
        raise ValueError("Firebase credentials must be provided either through environment variables or JSON file")


settings = Settings()
