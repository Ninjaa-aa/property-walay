"""
PPT Export Schemas
Request/Response schemas for PPT generation API
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum


class PPTExportStatus(str, Enum):
    """Status of PPT export job"""
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class PPTExportRequest(BaseModel):
    """Request schema for generating PPT"""
    property_id: UUID = Field(..., description="Property ID to generate PPT for")


class PPTExportResponse(BaseModel):
    """Response schema for PPT export"""
    id: UUID
    user_id: UUID
    property_id: UUID
    status: PPTExportStatus
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    duration_ms: Optional[int] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PPTExportJobResponse(BaseModel):
    """Response schema for PPT generation job creation"""
    job_id: UUID
    status: PPTExportStatus
    message: str


class PPTExportListResponse(BaseModel):
    """Response schema for listing PPT exports"""
    items: list[PPTExportResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PPTExportActivityResponse(BaseModel):
    """Response schema for recent PPT export activity"""
    id: UUID
    property_id: UUID
    property_title: Optional[str] = None
    property_location: Optional[str] = None
    status: PPTExportStatus
    file_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

