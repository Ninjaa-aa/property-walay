"""
API dependencies
"""
from typing import Generator
from app.core.database.database import SessionLocal


def get_database() -> Generator:
    """
    Provide a SQLAlchemy session for request scope.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


