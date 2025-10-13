from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid
from app.firebase_auth import get_current_user
from app.database import get_db
from app.models import WishListItem, User, Book

router = APIRouter()


class WishlistRequest(BaseModel):
    book_id: str
    notify_when_available: bool = True


class WishlistRequestWithBook(BaseModel):
    book_id: str
    notify_when_available: bool = True


class WishlistResponse(BaseModel):
    id: str
    bookId: str
    userId: str
    addedDate: str
    notifyWhenAvailable: bool


def ensure_user_exists(db: Session, user_id: str):
    """Ensure user exists in database"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, email=f"{user_id}@placeholder.com", display_name="User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def ensure_book_exists(db: Session, book_id: str):
    """Ensure book exists in database, create if not with default stock of 1"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        book = Book(
            id=book_id,
            popularity=0,
            stock=1,  # Default stock is 1
        )
        db.add(book)
        db.commit()
        db.refresh(book)
    return book


@router.get("", response_model=List[WishlistResponse])
async def get_wishlist(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's wishlist"""
    ensure_user_exists(db, current_user)
    
    wishlist_items = db.query(WishListItem).filter(
        WishListItem.user_id == current_user
    ).all()
    
    return [
        WishlistResponse(
            id=item.id,
            bookId=item.book_id,
            userId=item.user_id,
            addedDate=item.added_date.isoformat(),
            notifyWhenAvailable=item.notify_when_available,
        )
        for item in wishlist_items
    ]


@router.get("/check/{book_id}")
async def check_if_in_wishlist(
    book_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if a book is in user's wishlist"""
    ensure_user_exists(db, current_user)
    
    item = db.query(WishListItem).filter(
        WishListItem.user_id == current_user,
        WishListItem.book_id == book_id
    ).first()
    
    return {"in_wishlist": item is not None}


@router.post("", response_model=WishlistResponse)
async def add_to_wishlist(
    request: WishlistRequestWithBook,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a book to wishlist"""
    ensure_user_exists(db, current_user)
    ensure_book_exists(db, request.book_id)
    
    # Check if already in wishlist
    existing = db.query(WishListItem).filter(
        WishListItem.user_id == current_user,
        WishListItem.book_id == request.book_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Book already in wishlist")
    
    wishlist_item = WishListItem(
        id=str(uuid.uuid4()),
        user_id=current_user,
        book_id=request.book_id,
        notify_when_available=request.notify_when_available,
    )
    
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    
    return WishlistResponse(
        id=wishlist_item.id,
        bookId=wishlist_item.book_id,
        userId=wishlist_item.user_id,
        addedDate=wishlist_item.added_date.isoformat(),
        notifyWhenAvailable=wishlist_item.notify_when_available,
    )


@router.delete("/{book_id}")
async def remove_from_wishlist(
    book_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a book from wishlist by book_id"""
    ensure_user_exists(db, current_user)
    
    wishlist_item = db.query(WishListItem).filter(
        WishListItem.user_id == current_user,
        WishListItem.book_id == book_id
    ).first()
    
    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Book not found in wishlist")
    
    db.delete(wishlist_item)
    db.commit()
    
    return {
        "message": "Book removed from wishlist",
        "book_id": book_id,
    }

