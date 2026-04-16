from pydantic import BaseModel, Field
from typing import Optional, Any


class ChatQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="User's natural language query")


class WebhookFilters(BaseModel):
    city: Optional[str] = None
    area_name: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_area: Optional[float] = None
    max_area: Optional[float] = None
    area_unit: Optional[str] = None
    listing_type: Optional[str] = None
    prop_type: Optional[str] = None


class WebhookProperty(BaseModel):
    our_id: Optional[str] = None
    source: Optional[str] = None
    source_id: Optional[str] = None
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
    images: Optional[list[str]] = None
    poc_name: Optional[str] = None
    poc_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_price: Optional[float] = None
    currency: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    last_price_change_at: Optional[str] = None
    listing_type: Optional[str] = None


class PropertyResultItem(BaseModel):
    filters: WebhookFilters
    properties: list[WebhookProperty]


class TextResultItem(BaseModel):
    Response: str


class ChatQueryResponse(BaseModel):
    type: str = Field(..., description="'properties' or 'text'")
    text: Optional[str] = None
    filters: Optional[WebhookFilters] = None
    properties: Optional[list[WebhookProperty]] = None
