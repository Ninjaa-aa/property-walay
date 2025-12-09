"""
Pydantic schemas for Property Trends API.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date


# ============================================
# Region Schemas
# ============================================

class TrendsRegionBase(BaseModel):
    """Base schema for region data."""
    id: int
    name: str
    name_urdu: Optional[str] = None
    level: int = 2
    
    model_config = ConfigDict(from_attributes=True)


class TrendsRegionResponse(TrendsRegionBase):
    """Response schema for region with timestamps."""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# City Schemas
# ============================================

class TrendsCityBase(BaseModel):
    """Base schema for city data."""
    id: int
    name: str
    name_urdu: Optional[str] = None
    region_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    level: int = 3


class TrendsCityResponse(TrendsCityBase):
    """Response schema for city with region info."""
    region: Optional[TrendsRegionBase] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class TrendsCityWithLocations(TrendsCityResponse):
    """City response with list of locations."""
    buying_locations: List["TrendsLocationResponse"] = []
    renting_locations: List["TrendsLocationResponse"] = []
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Location Schemas
# ============================================

class TrendsLocationBase(BaseModel):
    """Base schema for location data."""
    id: int
    title: str
    title_urdu: Optional[str] = None
    city_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)


class TrendsLocationResponse(TrendsLocationBase):
    """Response schema for location."""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class TrendsLocationWithStats(TrendsLocationResponse):
    """Location response with monthly stats and rankings."""
    monthly_stats: List["TrendsMonthlyStatsResponse"] = []
    latest_ranking: Optional["TrendsPositionRankingResponse"] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Monthly Stats Schemas
# ============================================

class TrendsMonthlyStatsBase(BaseModel):
    """Base schema for monthly stats."""
    location_id: int
    category: str = Field(..., pattern="^(buying|renting)$")
    stats_date: date
    month_year: Optional[str] = None
    view_count: int = 0
    search_percentage: float = 0.0


class TrendsMonthlyStatsResponse(TrendsMonthlyStatsBase):
    """Response schema for monthly stats."""
    id: int
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Position Ranking Schemas
# ============================================

class TrendsPositionRankingBase(BaseModel):
    """Base schema for position rankings."""
    location_id: int
    city_id: int
    category: str = Field(..., pattern="^(buying|renting)$")
    stats_date: date
    current_position: Optional[int] = None
    previous_position: Optional[int] = None
    position_change: Optional[int] = None
    current_search_percentage: Optional[float] = None
    previous_search_percentage: Optional[float] = None
    search_percentage_change: Optional[float] = None
    current_view_count: Optional[int] = None


class TrendsPositionRankingResponse(TrendsPositionRankingBase):
    """Response schema for position rankings."""
    id: int
    location: Optional[TrendsLocationBase] = None
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Metadata Schemas
# ============================================

class TrendsMetadataResponse(BaseModel):
    """Response schema for trends metadata."""
    last_import: Optional[str] = None
    data_version: Optional[str] = None
    buying_total_locations: Optional[int] = None
    renting_total_locations: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Summary/Aggregate Schemas
# ============================================

class TrendsSummaryResponse(BaseModel):
    """Summary response for trends overview."""
    total_regions: int
    total_cities: int
    total_locations: int
    buying_locations: int
    renting_locations: int
    latest_data_date: Optional[date] = None
    last_import: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============================================
# Search/Filter Params
# ============================================

class TrendsSearchParams(BaseModel):
    """Parameters for searching trends data."""
    category: Optional[str] = Field(None, pattern="^(buying|renting)$")
    region_id: Optional[int] = None
    city_id: Optional[int] = None
    location_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    min_position: Optional[int] = None
    max_position: Optional[int] = None
    limit: int = Field(default=50, ge=1, le=500)
    offset: int = Field(default=0, ge=0)

