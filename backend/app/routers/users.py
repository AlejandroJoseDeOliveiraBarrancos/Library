from fastapi import APIRouter, Depends
from app.firebase_auth import get_current_user

router = APIRouter()


@router.get("/me")
async def get_current_user_info(current_user: str = Depends(get_current_user)):
    return {
        "user_id": current_user,
        "message": "User info endpoint",
        "note": "This is a placeholder. Implement with database integration.",
    }


@router.get("/profile")
async def get_user_profile(current_user: str = Depends(get_current_user)):
    return {
        "user_id": current_user,
        "total_loans": 0,
        "active_loans": 0,
        "wishlist_count": 0,
        "books_read": 0,
    }

