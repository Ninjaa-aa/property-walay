"""
PPT Export Model
Tracks all PPT generation requests and their status
"""
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


class PPTExportStatus(str, enum.Enum):
    """Status of PPT export job"""
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class PPTExport(Base):
    """PPT Export model for tracking generation jobs"""
    __tablename__ = "ppt_exports"
    __table_args__ = {"schema": "public"}

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid()
    )
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    property_id = Column(
        UUID(as_uuid=True),
        ForeignKey("public.properties.our_id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    status = Column(
        String(20),
        nullable=False,
        default=PPTExportStatus.QUEUED.value,
        index=True
    )
    file_url = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)  # Size in bytes
    duration_ms = Column(Integer, nullable=True)  # Generation duration
    error_message = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<PPTExport(id={self.id}, property_id={self.property_id}, status={self.status})>"

