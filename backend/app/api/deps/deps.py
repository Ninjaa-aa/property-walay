"""
API dependencies
"""
from typing import Generator
from sqlalchemy.orm import Session
from app.core.database.database import SessionLocal


def get_database() -> Generator[Session, None, None]:
    """
    Provide a SQLAlchemy session for request scope.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


