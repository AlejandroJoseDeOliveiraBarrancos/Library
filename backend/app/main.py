from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import books, loans, wishlist, users
from app.firebase_auth import initialize_firebase
from app.database import create_tables

app = FastAPI(
    title="Library API",
    description="Backend API for Library Management System",
    version="1.0.0",
)

# Initialize Firebase Admin SDK
initialize_firebase()

# Create database tables
create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router, prefix="/api/books", tags=["Books"])
app.include_router(loans.router, prefix="/api/loans", tags=["Loans"])
app.include_router(wishlist.router, prefix="/api/wishlist", tags=["Wishlist"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])


@app.get("/")
async def root():
    return {
        "message": "Library API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

