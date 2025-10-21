from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid
from app.firebase_auth import get_current_user
from app.database import get_db
from app.models import Loan, User, Book
from app.services.google_books import google_books_service

router = APIRouter()


class AdminLoanResponse(BaseModel):
    id: str
    book_id: str
    user_id: str
    user_display_name: str
    user_email: str
    borrowed_date: str
    due_date: str
    status: str
    book_title: str
    book_image: str
    book_authors: List[str]




@router.get("/loans", response_model=List[AdminLoanResponse])
async def get_all_active_loans(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active loans for admin management"""
    # Get all active loans with user information
    loans = db.query(Loan, User).join(
        User, Loan.user_id == User.id
    ).filter(
        Loan.status == "active"
    ).all()
    
    result = []
    for loan, user in loans:
        try:
            # Get book details from Google Books API
            book_data = await google_books_service.get_book(loan.book_id)
            
            result.append(AdminLoanResponse(
                id=loan.id,
                book_id=loan.book_id,
                user_id=loan.user_id,
                user_display_name=user.display_name or "",
                user_email=user.email or "",
                borrowed_date=loan.borrowed_date.isoformat(),
                due_date=loan.due_date.isoformat(),
                status=loan.status,
                book_title=book_data.get("title", ""),
                book_image=book_data.get("coverImage", ""),
                book_authors=book_data.get("authors", []),
            ))
        except Exception as e:
            # If book details can't be fetched, return 500 error
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch book details for book {loan.book_id}: {str(e)}"
            )
    
    return result


@router.put("/loans/{loan_id}/return")
async def admin_return_book(
    loan_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Admin endpoint to return a book on behalf of a user"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.status != "active":
        raise HTTPException(status_code=400, detail="Loan is not active")
    
    # Mark loan as returned
    loan.status = "returned"
    loan.returned_date = datetime.utcnow()
    
    # Increase stock back
    book = db.query(Book).filter(Book.id == loan.book_id).first()
    if book:
        book.stock += 1
    
    db.commit()
    
    return {
        "message": "Book returned successfully by admin",
        "loan_id": loan_id,
        "returned_date": loan.returned_date.isoformat(),
        "admin_user_id": current_user,
    }


@router.get("/users/{user_id}/make-admin")
async def make_user_admin(
    user_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Make a user an admin"""
    target_user = db.query(User).filter(User.id == user_id).first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_admin = True
    db.commit()
    
    return {
        "message": f"User {target_user.email} is now an admin",
        "user_id": user_id,
        "admin_user_id": current_user,
    }


@router.get("/users/{user_id}/remove-admin")
async def remove_user_admin(
    user_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove admin privileges from a user"""
    if user_id == current_user:
        raise HTTPException(status_code=400, detail="Cannot remove your own admin privileges")
    
    target_user = db.query(User).filter(User.id == user_id).first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_admin = False
    db.commit()
    
    return {
        "message": f"User {target_user.email} is no longer an admin",
        "user_id": user_id,
        "admin_user_id": current_user,
    }
