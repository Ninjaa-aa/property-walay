"""
Trends API Routes
Provides endpoints for accessing property trends data including regions, cities,
locations, monthly statistics, and position rankings.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, and_
from typing import Optional, List
from datetime import date

from app.api.deps import get_database
from app.models.trends.trends import (
    TrendsRegion,
    TrendsCity,
    TrendsLocation,
    TrendsMonthlyStats,
    TrendsPositionRanking,
    TrendsMetadata,
)
from app.schemas.trends.trends import (
    TrendsRegionResponse,
    TrendsCityResponse,
    TrendsLocationResponse,
    TrendsLocationWithStats,
    TrendsMonthlyStatsResponse,
    TrendsPositionRankingResponse,
    TrendsSummaryResponse,
    TrendsMetadataResponse,
)
from app.core.cache.cache import (
    get_cache_key,
    get_from_cache,
    set_cache,
)

router = APIRouter(prefix="/trends", tags=["trends"])


# ============================================
# Summary & Overview Endpoints
# ============================================

@router.get("/summary", response_model=TrendsSummaryResponse)
def get_trends_summary(db: Session = Depends(get_database)):
    """
    Get overall trends summary including totals and latest data info.
    Cached for 10 minutes.
    """
    cache_key = get_cache_key("trends:summary")
    cached = get_from_cache(cache_key)
    if cached:
        return TrendsSummaryResponse(**cached)
    
    # Get counts
    total_regions = db.query(func.count(TrendsRegion.id)).scalar() or 0
    total_cities = db.query(func.count(TrendsCity.id)).scalar() or 0
    total_locations = db.query(func.count(TrendsLocation.id)).scalar() or 0
    
    # Get category-specific counts from position rankings
    buying_locations = db.query(func.count(func.distinct(TrendsPositionRanking.location_id))).filter(
        TrendsPositionRanking.category == "buying"
    ).scalar() or 0
    
    renting_locations = db.query(func.count(func.distinct(TrendsPositionRanking.location_id))).filter(
        TrendsPositionRanking.category == "renting"
    ).scalar() or 0
    
    # Get latest data date
    latest_date = db.query(func.max(TrendsMonthlyStats.stats_date)).scalar()
    
    # Get last import time from metadata
    last_import_meta = db.query(TrendsMetadata).filter(TrendsMetadata.key == "last_import").first()
    last_import = last_import_meta.updated_at if last_import_meta else None
    
    result = TrendsSummaryResponse(
        total_regions=total_regions,
        total_cities=total_cities,
        total_locations=total_locations,
        buying_locations=buying_locations,
        renting_locations=renting_locations,
        latest_data_date=latest_date,
        last_import=last_import,
    )
    
    set_cache(cache_key, result.model_dump(), ttl=600)
    return result


# ============================================
# Region Endpoints
# ============================================

@router.get("/regions", response_model=List[TrendsRegionResponse])
def list_regions(db: Session = Depends(get_database)):
    """
    Get all regions. Cached for 1 hour.
    """
    cache_key = get_cache_key("trends:regions")
    cached = get_from_cache(cache_key)
    if cached:
        return [TrendsRegionResponse(**r) for r in cached]
    
    regions = db.query(TrendsRegion).order_by(TrendsRegion.name).all()
    result = [TrendsRegionResponse.model_validate(r) for r in regions]
    
    set_cache(cache_key, [r.model_dump() for r in result], ttl=3600)
    return result


@router.get("/regions/{region_id}", response_model=TrendsRegionResponse)
def get_region(region_id: int, db: Session = Depends(get_database)):
    """Get a single region by ID."""
    region = db.query(TrendsRegion).filter(TrendsRegion.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region


@router.get("/regions/{region_id}/cities", response_model=List[TrendsCityResponse])
def get_region_cities(region_id: int, db: Session = Depends(get_database)):
    """Get all cities in a region."""
    cities = db.query(TrendsCity).filter(
        TrendsCity.region_id == region_id
    ).order_by(TrendsCity.name).all()
    return cities


# ============================================
# City Endpoints
# ============================================

@router.get("/cities", response_model=List[TrendsCityResponse])
def list_cities(
    region_id: Optional[int] = Query(None, description="Filter by region"),
    search: Optional[str] = Query(None, description="Search by city name"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database),
):
    """
    Get cities with optional filters. Cached for 30 minutes.
    """
    cache_key = get_cache_key("trends:cities", region_id=region_id, search=search, limit=limit, offset=offset)
    cached = get_from_cache(cache_key)
    if cached:
        return [TrendsCityResponse(**c) for c in cached]
    
    query = db.query(TrendsCity).options(joinedload(TrendsCity.region))
    
    if region_id:
        query = query.filter(TrendsCity.region_id == region_id)
    if search:
        query = query.filter(TrendsCity.name.ilike(f"%{search}%"))
    
    cities = query.order_by(TrendsCity.name).offset(offset).limit(limit).all()
    result = [TrendsCityResponse.model_validate(c) for c in cities]
    
    set_cache(cache_key, [c.model_dump() for c in result], ttl=1800)
    return result


@router.get("/cities/{city_id}", response_model=TrendsCityResponse)
def get_city(city_id: int, db: Session = Depends(get_database)):
    """Get a single city by ID."""
    city = db.query(TrendsCity).options(
        joinedload(TrendsCity.region)
    ).filter(TrendsCity.id == city_id).first()
    
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city


@router.get("/cities/{city_id}/locations", response_model=List[TrendsLocationResponse])
def get_city_locations(city_id: int, db: Session = Depends(get_database)):
    """Get all locations in a city."""
    locations = db.query(TrendsLocation).filter(
        TrendsLocation.city_id == city_id
    ).order_by(TrendsLocation.title).all()
    return locations


@router.get("/cities/{city_id}/top-locations")
def get_city_top_locations(
    city_id: int,
    category: str = Query("buying", pattern="^(buying|renting)$"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_database),
):
    """
    Get top trending locations in a city by position ranking.
    Returns locations with their latest ranking data.
    """
    cache_key = get_cache_key("trends:city_top", city_id=city_id, category=category, limit=limit)
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    # Get latest date for this city
    latest_date = db.query(func.max(TrendsPositionRanking.stats_date)).filter(
        TrendsPositionRanking.city_id == city_id,
        TrendsPositionRanking.category == category
    ).scalar()
    
    if not latest_date:
        return []
    
    # Get top locations by position
    rankings = db.query(TrendsPositionRanking).options(
        joinedload(TrendsPositionRanking.location)
    ).filter(
        TrendsPositionRanking.city_id == city_id,
        TrendsPositionRanking.category == category,
        TrendsPositionRanking.stats_date == latest_date
    ).order_by(TrendsPositionRanking.current_position.asc()).limit(limit).all()
    
    result = []
    for r in rankings:
        result.append({
            "location_id": r.location_id,
            "title": r.location.title if r.location else None,
            "title_urdu": r.location.title_urdu if r.location else None,
            "latitude": float(r.location.latitude) if r.location and r.location.latitude else None,
            "longitude": float(r.location.longitude) if r.location and r.location.longitude else None,
            "current_position": r.current_position,
            "previous_position": r.previous_position,
            "position_change": r.position_change,
            "current_search_percentage": float(r.current_search_percentage) if r.current_search_percentage else None,
            "current_view_count": r.current_view_count,
            "stats_date": str(r.stats_date),
        })
    
    set_cache(cache_key, result, ttl=600)
    return result


# ============================================
# Location Endpoints
# ============================================

@router.get("/locations", response_model=List[TrendsLocationResponse])
def list_locations(
    city_id: Optional[int] = Query(None, description="Filter by city"),
    search: Optional[str] = Query(None, description="Search by location title"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database),
):
    """Get locations with optional filters."""
    query = db.query(TrendsLocation)
    
    if city_id:
        query = query.filter(TrendsLocation.city_id == city_id)
    if search:
        query = query.filter(TrendsLocation.title.ilike(f"%{search}%"))
    
    locations = query.order_by(TrendsLocation.title).offset(offset).limit(limit).all()
    return locations


@router.get("/locations/{location_id}", response_model=TrendsLocationWithStats)
def get_location(location_id: int, db: Session = Depends(get_database)):
    """Get a single location with its stats and latest ranking."""
    location = db.query(TrendsLocation).filter(TrendsLocation.id == location_id).first()
    
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Get monthly stats (last 12 months)
    monthly_stats = db.query(TrendsMonthlyStats).filter(
        TrendsMonthlyStats.location_id == location_id
    ).order_by(desc(TrendsMonthlyStats.stats_date)).limit(24).all()
    
    # Get latest ranking
    latest_ranking = db.query(TrendsPositionRanking).filter(
        TrendsPositionRanking.location_id == location_id
    ).order_by(desc(TrendsPositionRanking.stats_date)).first()
    
    return TrendsLocationWithStats(
        id=location.id,
        title=location.title,
        title_urdu=location.title_urdu,
        city_id=location.city_id,
        latitude=float(location.latitude) if location.latitude else None,
        longitude=float(location.longitude) if location.longitude else None,
        created_at=location.created_at,
        updated_at=location.updated_at,
        monthly_stats=[TrendsMonthlyStatsResponse.model_validate(s) for s in monthly_stats],
        latest_ranking=TrendsPositionRankingResponse.model_validate(latest_ranking) if latest_ranking else None,
    )


@router.get("/locations/{location_id}/history")
def get_location_history(
    location_id: int,
    category: str = Query("buying", pattern="^(buying|renting)$"),
    months: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_database),
):
    """
    Get historical trend data for a location.
    Returns monthly stats for chart visualization.
    """
    cache_key = get_cache_key("trends:location_history", location_id=location_id, category=category, months=months)
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    stats = db.query(TrendsMonthlyStats).filter(
        TrendsMonthlyStats.location_id == location_id,
        TrendsMonthlyStats.category == category
    ).order_by(TrendsMonthlyStats.stats_date.asc()).limit(months).all()
    
    result = {
        "location_id": location_id,
        "category": category,
        "labels": [s.month_year or str(s.stats_date) for s in stats],
        "view_counts": [s.view_count for s in stats],
        "search_percentages": [float(s.search_percentage) for s in stats],
        "dates": [str(s.stats_date) for s in stats],
    }
    
    set_cache(cache_key, result, ttl=600)
    return result


# ============================================
# Rankings Endpoints
# ============================================

@router.get("/rankings/top-movers")
def get_top_movers(
    category: str = Query("buying", pattern="^(buying|renting)$"),
    direction: str = Query("up", pattern="^(up|down)$"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_database),
):
    """
    Get locations with biggest position changes (movers).
    Direction 'up' = improved rankings, 'down' = declined rankings.
    """
    cache_key = get_cache_key("trends:top_movers", category=category, direction=direction, limit=limit)
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    # Get latest date
    latest_date = db.query(func.max(TrendsPositionRanking.stats_date)).filter(
        TrendsPositionRanking.category == category
    ).scalar()
    
    if not latest_date:
        return []
    
    query = db.query(TrendsPositionRanking).options(
        joinedload(TrendsPositionRanking.location),
        joinedload(TrendsPositionRanking.city)
    ).filter(
        TrendsPositionRanking.category == category,
        TrendsPositionRanking.stats_date == latest_date,
        TrendsPositionRanking.position_change.isnot(None),
        TrendsPositionRanking.position_change != 0
    )
    
    if direction == "up":
        query = query.filter(TrendsPositionRanking.position_change > 0)
        query = query.order_by(desc(TrendsPositionRanking.position_change))
    else:
        query = query.filter(TrendsPositionRanking.position_change < 0)
        query = query.order_by(TrendsPositionRanking.position_change.asc())
    
    rankings = query.limit(limit).all()
    
    result = []
    for r in rankings:
        result.append({
            "location_id": r.location_id,
            "location_title": r.location.title if r.location else None,
            "city_id": r.city_id,
            "city_name": r.city.name if r.city else None,
            "current_position": r.current_position,
            "previous_position": r.previous_position,
            "position_change": r.position_change,
            "current_search_percentage": float(r.current_search_percentage) if r.current_search_percentage else None,
            "current_view_count": r.current_view_count,
        })
    
    set_cache(cache_key, result, ttl=600)
    return result


@router.get("/rankings/city/{city_id}")
def get_city_rankings(
    city_id: int,
    category: str = Query("buying", pattern="^(buying|renting)$"),
    stats_date: Optional[date] = Query(None, description="Specific date, defaults to latest"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_database),
):
    """Get position rankings for all locations in a city."""
    if not stats_date:
        stats_date = db.query(func.max(TrendsPositionRanking.stats_date)).filter(
            TrendsPositionRanking.city_id == city_id,
            TrendsPositionRanking.category == category
        ).scalar()
    
    if not stats_date:
        return []
    
    rankings = db.query(TrendsPositionRanking).options(
        joinedload(TrendsPositionRanking.location)
    ).filter(
        TrendsPositionRanking.city_id == city_id,
        TrendsPositionRanking.category == category,
        TrendsPositionRanking.stats_date == stats_date
    ).order_by(TrendsPositionRanking.current_position.asc()).limit(limit).all()
    
    return [TrendsPositionRankingResponse.model_validate(r) for r in rankings]


# ============================================
# Analytics Endpoints
# ============================================

@router.get("/analytics/overview")
def get_analytics_overview(
    category: str = Query("buying", pattern="^(buying|renting)$"),
    db: Session = Depends(get_database),
):
    """
    Get analytics overview data for dashboard.
    Includes aggregated stats across all regions.
    """
    cache_key = get_cache_key("trends:analytics_overview", category=category)
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    # Get latest date
    latest_date = db.query(func.max(TrendsMonthlyStats.stats_date)).filter(
        TrendsMonthlyStats.category == category
    ).scalar()
    
    # Get total view count for latest month
    total_views = db.query(func.sum(TrendsMonthlyStats.view_count)).filter(
        TrendsMonthlyStats.category == category,
        TrendsMonthlyStats.stats_date == latest_date
    ).scalar() or 0
    
    # Get average search percentage
    avg_search_pct = db.query(func.avg(TrendsMonthlyStats.search_percentage)).filter(
        TrendsMonthlyStats.category == category,
        TrendsMonthlyStats.stats_date == latest_date
    ).scalar() or 0
    
    # Get top 5 cities by view count
    top_cities = db.query(
        TrendsCity.id,
        TrendsCity.name,
        func.sum(TrendsMonthlyStats.view_count).label('total_views')
    ).join(
        TrendsLocation, TrendsCity.id == TrendsLocation.city_id
    ).join(
        TrendsMonthlyStats, TrendsLocation.id == TrendsMonthlyStats.location_id
    ).filter(
        TrendsMonthlyStats.category == category,
        TrendsMonthlyStats.stats_date == latest_date
    ).group_by(TrendsCity.id, TrendsCity.name).order_by(
        desc('total_views')
    ).limit(5).all()
    
    # Get region distribution
    region_stats = db.query(
        TrendsRegion.id,
        TrendsRegion.name,
        func.count(func.distinct(TrendsCity.id)).label('city_count'),
        func.count(func.distinct(TrendsLocation.id)).label('location_count')
    ).join(
        TrendsCity, TrendsRegion.id == TrendsCity.region_id
    ).join(
        TrendsLocation, TrendsCity.id == TrendsLocation.city_id
    ).group_by(TrendsRegion.id, TrendsRegion.name).all()
    
    result = {
        "category": category,
        "latest_date": str(latest_date) if latest_date else None,
        "total_views": total_views,
        "average_search_percentage": round(float(avg_search_pct), 2),
        "top_cities": [
            {"id": c.id, "name": c.name, "total_views": c.total_views}
            for c in top_cities
        ],
        "region_distribution": [
            {"id": r.id, "name": r.name, "city_count": r.city_count, "location_count": r.location_count}
            for r in region_stats
        ],
    }
    
    set_cache(cache_key, result, ttl=600)
    return result


@router.get("/analytics/comparison")
def get_location_comparison(
    location_ids: str = Query(..., description="Comma-separated location IDs"),
    category: str = Query("buying", pattern="^(buying|renting)$"),
    db: Session = Depends(get_database),
):
    """
    Compare multiple locations side by side.
    Returns historical data for comparison charts.
    """
    ids = [int(id.strip()) for id in location_ids.split(",") if id.strip().isdigit()]
    
    if not ids or len(ids) > 5:
        raise HTTPException(status_code=400, detail="Provide 1-5 location IDs")
    
    result = []
    for loc_id in ids:
        location = db.query(TrendsLocation).filter(TrendsLocation.id == loc_id).first()
        if not location:
            continue
        
        stats = db.query(TrendsMonthlyStats).filter(
            TrendsMonthlyStats.location_id == loc_id,
            TrendsMonthlyStats.category == category
        ).order_by(TrendsMonthlyStats.stats_date.asc()).all()
        
        result.append({
            "location_id": loc_id,
            "title": location.title,
            "data": {
                "labels": [s.month_year or str(s.stats_date) for s in stats],
                "view_counts": [s.view_count for s in stats],
                "search_percentages": [float(s.search_percentage) for s in stats],
            }
        })
    
    return result


# ============================================
# Map Data Endpoints
# ============================================

@router.get("/map/locations")
def get_map_locations(
    region_id: Optional[int] = Query(None),
    city_id: Optional[int] = Query(None),
    category: str = Query("buying", pattern="^(buying|renting)$"),
    db: Session = Depends(get_database),
):
    """
    Get locations with coordinates for map visualization.
    Includes latest ranking data for marker styling.
    """
    cache_key = get_cache_key("trends:map_locations", region_id=region_id, city_id=city_id, category=category)
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    # Build query
    query = db.query(TrendsLocation).filter(
        TrendsLocation.latitude.isnot(None),
        TrendsLocation.longitude.isnot(None)
    )
    
    if city_id:
        query = query.filter(TrendsLocation.city_id == city_id)
    elif region_id:
        query = query.join(TrendsCity).filter(TrendsCity.region_id == region_id)
    
    locations = query.limit(500).all()
    
    # Get latest rankings for these locations
    location_ids = [l.id for l in locations]
    
    latest_date = db.query(func.max(TrendsPositionRanking.stats_date)).filter(
        TrendsPositionRanking.category == category
    ).scalar()
    
    rankings_map = {}
    if latest_date and location_ids:
        rankings = db.query(TrendsPositionRanking).filter(
            TrendsPositionRanking.location_id.in_(location_ids),
            TrendsPositionRanking.category == category,
            TrendsPositionRanking.stats_date == latest_date
        ).all()
        rankings_map = {r.location_id: r for r in rankings}
    
    result = []
    for loc in locations:
        ranking = rankings_map.get(loc.id)
        result.append({
            "id": loc.id,
            "title": loc.title,
            "city_id": loc.city_id,
            "latitude": float(loc.latitude),
            "longitude": float(loc.longitude),
            "position": ranking.current_position if ranking else None,
            "position_change": ranking.position_change if ranking else None,
            "view_count": ranking.current_view_count if ranking else None,
            "search_percentage": float(ranking.current_search_percentage) if ranking and ranking.current_search_percentage else None,
        })
    
    set_cache(cache_key, result, ttl=600)
    return result


@router.get("/map/cities")
def get_map_cities(
    region_id: Optional[int] = Query(None),
    db: Session = Depends(get_database),
):
    """
    Get cities with coordinates for map visualization.
    """
    query = db.query(TrendsCity).filter(
        TrendsCity.latitude.isnot(None),
        TrendsCity.longitude.isnot(None)
    )
    
    if region_id:
        query = query.filter(TrendsCity.region_id == region_id)
    
    cities = query.all()
    
    return [
        {
            "id": c.id,
            "name": c.name,
            "region_id": c.region_id,
            "latitude": float(c.latitude),
            "longitude": float(c.longitude),
        }
        for c in cities
    ]

