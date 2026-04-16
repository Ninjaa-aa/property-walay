from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import Optional
from uuid import UUID

from app.api.deps import get_database
from app.models.property.property import Property
from app.schemas.property import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
    PropertyListResponse,
    PropertyFilterParams,
)
from app.core.cache.cache import (
    get_cache_key,
    get_from_cache,
    set_cache,
    delete_cache_pattern,
)

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=PropertyListResponse)
def list_properties(
    source: Optional[str] = Query(None, description="Filter by source: graana, lamudi, zameen"),
    prop_type: Optional[str] = Query(None, description="Filter by property type"),
    prop_subtype: Optional[str] = Query(None, description="Filter by property subtype"),
    listing_type: Optional[str] = Query(None, description="Filter by listing type: rent or sale"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    currency: Optional[str] = Query(None),
    beds: Optional[int] = Query(None, ge=0),
    baths: Optional[int] = Query(None, ge=0),
    area_name: Optional[str] = Query(None),
    min_area_size: Optional[float] = Query(None, ge=0),
    max_area_size: Optional[float] = Query(None, ge=0),
    page: int = Query(1, ge=1
                      ),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_database),
):
    """
    List properties with optional filters and pagination.
    Cached for 5 minutes.
    """
    # Generate cache key from query parameters
    cache_key = get_cache_key(
        "properties:list",
        source=source,
        prop_type=prop_type,
        prop_subtype=prop_subtype,
        listing_type=listing_type,
        min_price=min_price,
        max_price=max_price,
        currency=currency,
        beds=beds,
        baths=baths,
        area_name=area_name,
        min_area_size=min_area_size,
        max_area_size=max_area_size,
        page=page,
        page_size=page_size,
    )
    
    # Try to get from cache
    cached_result = get_from_cache(cache_key)
    if cached_result:
        return PropertyListResponse(**cached_result)
    
    query = db.query(Property)
    
    # Apply filters
    if source:
        query = query.filter(Property.source == source)
    if prop_type:
        # Normalize and match common variants (e.g., Homes/Residential, Plot/Plots)
        normalized_prop_type = prop_type.strip().lower()
        equivalents = {
            "commercial": ["commercial"],
            "homes": ["homes", "residential"],
            "residential": ["residential", "homes"],
            "plot": ["plot", "plots"],
            "plots": ["plot", "plots"],
        }
        match_values = equivalents.get(normalized_prop_type, [normalized_prop_type])
        query = query.filter(func.lower(Property.prop_type).in_(match_values))
    if prop_subtype:
        query = query.filter(Property.prop_subtype == prop_subtype)
    if listing_type:
        query = query.filter(func.lower(Property.listing_type) == listing_type.strip().lower())
    if min_price is not None:
        query = query.filter(Property.current_price >= min_price)
    if max_price is not None:
        query = query.filter(Property.current_price <= max_price)
    if currency:
        query = query.filter(Property.currency == currency)
    if beds is not None:
        query = query.filter(Property.beds == beds)
    if baths is not None:
        query = query.filter(Property.baths == baths)
    if area_name:
        query = query.filter(Property.area_name.ilike(f"%{area_name}%"))
    if min_area_size is not None:
        query = query.filter(Property.area_size >= min_area_size)
    if max_area_size is not None:
        query = query.filter(Property.area_size <= max_area_size)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    properties = query.order_by(Property.updated_at.desc()).offset(offset).limit(page_size).all()
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size
    
    result = PropertyListResponse(
        items=properties,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
    
    # Cache the result
    set_cache(cache_key, result.model_dump(), ttl=300)  # 5 minutes
    
    return result


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: UUID,
    db: Session = Depends(get_database),
):
    """
    Get a single property by ID.
    """
    property_obj = db.query(Property).filter(Property.our_id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    
    return property_obj


@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_database),
):
    """
    Create a new property.
    """
    # Check if property with same source and source_id already exists
    existing = db.query(Property).filter(
        and_(
            Property.source == property_data.source,
            Property.source_id == property_data.source_id
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Property with source '{property_data.source}' and source_id '{property_data.source_id}' already exists"
        )
    
    # Create new property
    property_obj = Property(**property_data.model_dump())
    db.add(property_obj)
    db.commit()
    db.refresh(property_obj)
    
    # Invalidate cache
    delete_cache_pattern("properties:*")
    
    return property_obj


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: UUID,
    property_data: PropertyUpdate,
    db: Session = Depends(get_database),
):
    """
    Update a property.
    """
    property_obj = db.query(Property).filter(Property.our_id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    
    # Update only provided fields
    update_data = property_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property_obj, field, value)
    
    # Track price changes
    if "current_price" in update_data and property_obj.current_price != update_data["current_price"]:
        from datetime import datetime, timezone
        property_obj.last_price_change_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(property_obj)
    
    # Invalidate cache
    delete_cache_pattern("properties:*")
    
    return property_obj


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: UUID,
    db: Session = Depends(get_database),
):
    """
    Delete a property.
    """
    property_obj = db.query(Property).filter(Property.our_id == property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    
    db.delete(property_obj)
    db.commit()
    
    # Invalidate cache
    delete_cache_pattern("properties:*")
    
    return None


@router.get("/search/recommended", response_model=list[PropertyResponse])
def get_recommended_properties(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_database),
):
    """
    Get recommended properties (currently returns most recently updated).
    Cached for 2 minutes (shorter TTL since recommendations change more frequently).
    TODO: Implement AI-based recommendations using RAG.
    """
    # Generate cache key
    cache_key = get_cache_key("properties:recommended", limit=limit)
    
    # Try to get from cache
    cached_result = get_from_cache(cache_key)
    if cached_result:
        return [PropertyResponse(**item) for item in cached_result]
    
    properties = db.query(Property).order_by(
        Property.updated_at.desc()
    ).limit(limit).all()
    
    result = [PropertyResponse.model_validate(p) for p in properties]
    
    # Cache the result (shorter TTL for recommendations)
    set_cache(cache_key, [p.model_dump() for p in result], ttl=120)  # 2 minutes
    
    return result

