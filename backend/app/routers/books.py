from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.services.google_books import google_books_service
from app.database import get_db
from app.models import Book

router = APIRouter()


@router.get("/search")
async def search_books(
    query: Optional[str] = Query(None, description="Search query"),
    author: Optional[str] = Query(None, description="Author name"),
    category: Optional[str] = Query(None, description="Book category"),
    sortBy: str = Query("relevance", description="Sort order"),
    maxResults: int = Query(20, ge=1, le=40),
    startIndex: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    Search for books using Google Books API and include stock information
    """
    try:
        results = await google_books_service.search_books(
            query=query,
            author=author,
            category=category,
            sort_by=sortBy,
            max_results=maxResults,
            start_index=startIndex,
        )
        
        # Add stock information from database for each book
        for book in results.get("items", []):
            book_id = book["id"]
            db_book = db.query(Book).filter(Book.id == book_id).first()
            
            if db_book:
                book["popularity"] = db_book.popularity
                book["stock"] = db_book.stock
                book["availability"] = "available" if db_book.stock > 0 else "borrowed"
            else:
                # Book doesn't exist in DB yet - create it with default values
                new_book = Book(
                    id=book_id,
                    popularity=0,
                    stock=1,  # Default stock is 1
                )
                db.add(new_book)
                db.commit()
                db.refresh(new_book)
                
                book["popularity"] = new_book.popularity
                book["stock"] = new_book.stock
                book["availability"] = "available"
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search books: {str(e)}")


@router.get("/{book_id}")
async def get_book(book_id: str, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific book including popularity and stock.
    Automatically creates the book in database if it doesn't exist.
    """
    try:
        # Get book details from Google Books API
        book_data = await google_books_service.get_book(book_id)
        
        # Get book from database to include popularity and stock
        db_book = db.query(Book).filter(Book.id == book_id).first()
        
        # Add database fields to response
        if db_book:
            book_data["popularity"] = db_book.popularity
            book_data["stock"] = db_book.stock
            book_data["availability"] = "available" if db_book.stock > 0 else "borrowed"
        else:
            # Book doesn't exist in DB yet - create it with default values
            new_book = Book(
                id=book_id,
                popularity=0,
                stock=1,  # Default stock is 1
            )
            db.add(new_book)
            db.commit()
            db.refresh(new_book)
            
            book_data["popularity"] = new_book.popularity
            book_data["stock"] = new_book.stock
            book_data["availability"] = "available"
        
        return book_data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Book not found: {str(e)}")

