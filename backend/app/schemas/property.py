from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any, Union
from datetime import datetime
from uuid import UUID


class PropertyBase(BaseModel):
    source: str = Field(..., description="Source platform: graana, lamudi, or zameen")
    source_id: str = Field(..., description="Unique ID from source platform")
    source_human_id: Optional[str] = Field(None, description="Human-readable ID from source")
    title: Optional[str] = None
    prop_type: Optional[str] = None
    prop_subtype: Optional[str] = None
    area_size: Optional[float] = None
    area_unit: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area_name: Optional[str] = None
    link: Optional[str] = None
    # Images can be array of strings (URLs) or array of objects
    images: Optional[Union[list[str], list[dict[str, Any]]]] = None
    poc_name: Optional[str] = None
    poc_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_price: Optional[float] = None
    currency: Optional[str] = None


class PropertyCreate(PropertyBase):
    """Schema for creating a new property"""
    pass


class PropertyUpdate(BaseModel):
    """Schema for updating a property (all fields optional)"""
    source_human_id: Optional[str] = None
    title: Optional[str] = None
    prop_type: Optional[str] = None
    prop_subtype: Optional[str] = None
    area_size: Optional[float] = None
    area_unit: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area_name: Optional[str] = None
    link: Optional[str] = None
    # Images can be array of strings (URLs) or array of objects
    images: Optional[Union[list[str], list[dict[str, Any]]]] = None
    poc_name: Optional[str] = None
    poc_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_price: Optional[float] = None
    currency: Optional[str] = None


class PropertyResponse(PropertyBase):
    """Schema for property response"""
    our_id: UUID
    created_at: datetime
    updated_at: datetime
    last_price_change_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PropertyListResponse(BaseModel):
    """Schema for paginated property list response"""
    items: list[PropertyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PropertyFilterParams(BaseModel):
    """Schema for property filter parameters"""
    source: Optional[str] = None
    prop_type: Optional[str] = None
    prop_subtype: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    currency: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area_name: Optional[str] = None
    min_area_size: Optional[float] = None
    max_area_size: Optional[float] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

