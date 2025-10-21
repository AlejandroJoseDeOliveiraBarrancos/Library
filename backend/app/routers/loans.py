from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
import uuid
from app.firebase_auth import get_current_user
from app.database import get_db
from app.models import Loan, User, Book

router = APIRouter()


class LoanRequest(BaseModel):
    book_id: str


class LoanResponse(BaseModel):
    id: str
    book_id: str
    user_id: str
    borrowed_date: str
    due_date: str
    status: str


def ensure_user_exists(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=f"{user_id}@placeholder.com", display_name="User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def ensure_book_exists(db: Session, book_id: str):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        book = Book(
            id=book_id,
            popularity=0,
            stock=1,
        )
        db.add(book)
        db.commit()
        db.refresh(book)
    return book


@router.get("", response_model=List[LoanResponse])
async def get_my_loans(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ensure_user_exists(db, current_user)
    
    loans = db.query(Loan).filter(
        Loan.user_id == current_user,
        Loan.status == "active"
    ).all()
    
    return [
        LoanResponse(
            id=loan.id,
            book_id=loan.book_id,
            user_id=loan.user_id,
            borrowed_date=loan.borrowed_date.isoformat(),
            due_date=loan.due_date.isoformat(),
            status=loan.status,
        )
        for loan in loans
    ]


@router.post("", response_model=LoanResponse)
async def borrow_book(
    loan_request: LoanRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ensure_user_exists(db, current_user)
    book = ensure_book_exists(db, loan_request.book_id)
    
    if book.stock <= 0:
        raise HTTPException(
            status_code=400,
            detail="Book is currently out of stock. Add it to your wishlist to be notified when available."
        )
    
    existing_loan = db.query(Loan).filter(
        Loan.user_id == current_user,
        Loan.book_id == loan_request.book_id,
        Loan.status == "active"
    ).first()
    
    if existing_loan:
        raise HTTPException(status_code=400, detail="You already have this book on loan")
    
    borrowed_date = datetime.utcnow()
    due_date = borrowed_date + timedelta(days=14)
    
    loan = Loan(
        id=str(uuid.uuid4()),
        user_id=current_user,
        book_id=loan_request.book_id,
        borrowed_date=borrowed_date,
        due_date=due_date,
        status="active",
    )
    
    book.stock -= 1
    book.popularity += 1
    
    db.add(loan)
    db.commit()
    db.refresh(loan)
    
    return LoanResponse(
        id=loan.id,
        book_id=loan.book_id,
        user_id=loan.user_id,
        borrowed_date=loan.borrowed_date.isoformat(),
        due_date=loan.due_date.isoformat(),
        status=loan.status,
    )


@router.put("/{loan_id}/return")
async def return_book(
    loan_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ensure_user_exists(db, current_user)
    
    loan = db.query(Loan).filter(
        Loan.id == loan_id,
        Loan.user_id == current_user
    ).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.status != "active":
        raise HTTPException(status_code=400, detail="Loan is not active")
    
    loan.status = "returned"
    loan.returned_date = datetime.utcnow()
    
    book = db.query(Book).filter(Book.id == loan.book_id).first()
    if book:
        book.stock += 1
    
    db.commit()
    
    return {
        "message": "Book returned successfully",
        "loan_id": loan_id,
        "returned_date": loan.returned_date.isoformat(),
    }


@router.get("/{loan_id}")
async def get_loan(
    loan_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ensure_user_exists(db, current_user)
    
    loan = db.query(Loan).filter(
        Loan.id == loan_id,
        Loan.user_id == current_user
    ).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    return {
        "id": loan.id,
        "book_id": loan.book_id,
        "user_id": loan.user_id,
        "borrowed_date": loan.borrowed_date.isoformat(),
        "due_date": loan.due_date.isoformat(),
        "returned_date": loan.returned_date.isoformat() if loan.returned_date else None,
        "status": loan.status,
    }

