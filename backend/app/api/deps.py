from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db

# For now, we'll use simple dependency injection
# Later you can add JWT authentication here


def get_database(db: Session = Depends(get_db)):
    """Dependency to get database session"""
    return db


# TODO: Add authentication dependency when implementing JWT
# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     # Verify JWT token and return user
#     pass


