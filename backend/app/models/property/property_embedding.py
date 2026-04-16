"""
SQLAlchemy model for public.property_embeddings.

The `embedding` column is pgvector's `vector(N)` type but we do not bind
the pgvector SQLAlchemy adapter here: the recommendation service reads
the vector as its text literal (e.g. `"[0.1, -0.2, ...]"`) and parses it
into numpy, which avoids an extra runtime dependency.
"""

from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.core.database.database import Base


class PropertyEmbedding(Base):
    __tablename__ = "property_embeddings"
    __table_args__ = {"schema": "public"}

    our_id = Column(
        UUID(as_uuid=True),
        ForeignKey("public.properties.our_id", ondelete="CASCADE"),
        primary_key=True,
    )
    representation = Column(Text, nullable=False, default="numeric_pca")
    # Stored as pgvector vector(N) on the database side; read as text here.
    embedding = Column(Text, nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<PropertyEmbedding(our_id={self.our_id}, repr={self.representation})>"
