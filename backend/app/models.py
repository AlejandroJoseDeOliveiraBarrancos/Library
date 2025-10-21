from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True)
    popularity = Column(Integer, default=0, nullable=False)
    stock = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    display_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("Loan", back_populates="user")
    wishlist_items = relationship("WishListItem", back_populates="user")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    book_id = Column(String, index=True)
    borrowed_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    returned_date = Column(DateTime, nullable=True)
    status = Column(String, default="active")

    user = relationship("User", back_populates="loans")


class WishListItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    book_id = Column(String, index=True)
    added_date = Column(DateTime, default=datetime.utcnow)
    notify_when_available = Column(Boolean, default=True)

    user = relationship("User", back_populates="wishlist_items")


