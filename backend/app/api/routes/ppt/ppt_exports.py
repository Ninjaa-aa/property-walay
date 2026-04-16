"""
PPT Export API Routes
Endpoints for generating and managing property PPT exports
"""
import asyncio
import random
import time
import logging
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_database
from app.models.ppt.ppt_export import PPTExport, PPTExportStatus
from app.models.property.property import Property
from app.schemas.ppt.ppt_export import (
    PPTExportRequest,
    PPTExportResponse,
    PPTExportJobResponse,
    PPTExportListResponse,
    PPTExportActivityResponse,
    PPTExportStatus as PPTExportStatusSchema,
)
from app.services.ppt.ppt_generator import PropertyPPTGenerator, ImageOptimizer
from app.services.ppt.templates import TEMPLATES
from app.services.ppt.scrape_enrich import enrich_property_from_source
from app.utils.image_utils import clean_image_url
from app.core.cache.cache import get_cache_key, get_from_cache, set_cache

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ppt-exports", tags=["ppt-exports"])


def _extract_image_urls(images: list) -> list[str]:
    """Extract and clean image URLs from property images field."""
    if not images:
        return []

    urls: list[str] = []
    for img in images:
        raw = None
        if isinstance(img, str):
            raw = img
        elif isinstance(img, dict):
            # Try common keys for image URLs
            raw = (
                img.get("url")
                or img.get("src")
                or img.get("image")
                or img.get("original")
            )

        cleaned = clean_image_url(raw) if raw else None
        if cleaned:
            urls.append(cleaned)

    return urls


def _get_property_last_updated(property_obj: Property) -> Optional[datetime]:
    """
    Get the most relevant "last updated" timestamp for a property.
    Prefers updated_at, falls back to last_price_change_at, then created_at.
    """
    return (
        property_obj.updated_at
        or property_obj.last_price_change_at
        or property_obj.created_at
    )


def _template_cache_key(property_id: UUID, template_name: str) -> str:
    """Cache key that maps a (property, template) pair to a completed export_id."""
    return f"ppt:template:{property_id}:{template_name}"


async def _generate_ppt_task(
    export_id: UUID,
    property_data: dict,
    image_urls: list[str],
    db_url: str,
    template_name: str = None,
):
    """
    Background task to generate PPT.
    Updates the export record with results.
    """
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    
    # Create new database session for background task
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    start_time = time.time()
    
    try:
        # Update status to processing
        export = db.query(PPTExport).filter(PPTExport.id == export_id).first()
        if not export:
            logger.error(f"Export {export_id} not found")
            return
        
        export.status = PPTExportStatus.PROCESSING.value
        db.commit()
        
        # Fetch and optimize images
        images = []
        if image_urls:
            images = await ImageOptimizer.fetch_multiple(image_urls, max_images=5)
        
        # Generate PPT — pin to the chosen template so the correct style is used
        generator = PropertyPPTGenerator(template_name=template_name)
        ppt_stream = generator.generate(property_data, images)
        used_template = generator.template.name
        
        # Calculate file size
        ppt_stream.seek(0, 2)  # Seek to end
        file_size = ppt_stream.tell()
        ppt_stream.seek(0)  # Reset to beginning
        
        # Generate filename
        property_title = property_data.get("title", "property")
        safe_title = "".join(c for c in property_title if c.isalnum() or c in (' ', '-', '_'))[:50]
        file_name = f"{safe_title}_{export_id.hex[:8]}.pptx"
        
        # Store the PPT bytes in cache (1-hour TTL)
        cache_key = f"ppt:file:{export_id}"
        ppt_bytes = ppt_stream.getvalue()
        set_cache(cache_key, ppt_bytes.hex(), ttl=3600)

        # Store the per-template mapping: (property_id, template) → export_id
        # TTL matches the file cache so both expire together.
        property_id = property_data.get("our_id")
        if property_id and used_template:
            tpl_key = _template_cache_key(property_id, used_template)
            set_cache(tpl_key, str(export_id), ttl=3600)
            logger.info(f"Cached template mapping: {tpl_key} → {export_id}")
        
        # Update export record
        duration_ms = int((time.time() - start_time) * 1000)
        export.status = PPTExportStatus.COMPLETED.value
        export.file_name = file_name
        export.file_size = file_size
        export.duration_ms = duration_ms
        export.file_url = f"/api/v1/ppt-exports/{export_id}/download"
        export.completed_at = datetime.now(timezone.utc)
        db.commit()
        
        logger.info(f"PPT export {export_id} completed in {duration_ms}ms")
        
    except Exception as e:
        logger.error(f"PPT generation failed for export {export_id}: {e}")
        export = db.query(PPTExport).filter(PPTExport.id == export_id).first()
        if export:
            export.status = PPTExportStatus.FAILED.value
            export.error_message = str(e)
            export.completed_at = datetime.now(timezone.utc)
            db.commit()
    finally:
        db.close()
        engine.dispose()


@router.post("", response_model=PPTExportJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_ppt(
    request: PPTExportRequest,
    background_tasks: BackgroundTasks,
    user_id: UUID = Query(..., description="User ID (will be from auth in production)"),
    db: Session = Depends(get_database),
):
    """
    Generate a PPT presentation for a property.
    Returns immediately with a job ID; PPT is generated in background.
    """
    # Get property
    property_obj = db.query(Property).filter(Property.our_id == request.property_id).first()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {request.property_id} not found"
        )

    # Pick a random template for this request.
    chosen_template = random.choice(TEMPLATES)
    template_name = chosen_template.name

    # Check if this (property, template) combo was already generated and is still cached.
    tpl_key = _template_cache_key(str(request.property_id), template_name)
    cached_export_id = get_from_cache(tpl_key)
    if cached_export_id:
        # Verify the file bytes are still alive in cache too
        file_key = f"ppt:file:{cached_export_id}"
        if get_from_cache(file_key):
            logger.info(
                f"Cache hit for property={request.property_id} "
                f"template={template_name} → reusing export {cached_export_id}"
            )
            return PPTExportJobResponse(
                job_id=UUID(cached_export_id),
                status=PPTExportStatusSchema.COMPLETED,
                message=f"Reusing cached '{template_name}' export.",
            )

    # No cache hit — create a new export record and queue generation.
    export = PPTExport(
        user_id=user_id,
        property_id=request.property_id,
        status=PPTExportStatus.QUEUED.value,
    )
    db.add(export)
    db.commit()
    db.refresh(export)
    
    # Prepare property data for PPT generation
    property_data = {
        "our_id": str(property_obj.our_id),
        "title": property_obj.title,
        "prop_type": property_obj.prop_type,
        "prop_subtype": property_obj.prop_subtype,
        "area_size": float(property_obj.area_size) if property_obj.area_size else None,
        "area_unit": property_obj.area_unit,
        "beds": property_obj.beds,
        "baths": property_obj.baths,
        "area_name": property_obj.area_name,
        "current_price": float(property_obj.current_price) if property_obj.current_price else None,
        "currency": property_obj.currency,
        "latitude": float(property_obj.latitude) if property_obj.latitude else None,
        "longitude": float(property_obj.longitude) if property_obj.longitude else None,
        "source": property_obj.source,
        "source_human_id": property_obj.source_human_id,
        "poc_name": property_obj.poc_name,
        "poc_number": property_obj.poc_number,
        "link": property_obj.link,
        "scraped_contact": None,
        "scraped_features": None,
        "scraped_amenities": None,
    }
    
    # Extract image URLs
    image_urls = _extract_image_urls(property_obj.images)

    # Enrich with scraped data when available
    enrichment = await enrich_property_from_source(property_obj.source, property_obj.link)
    if enrichment:
        property_data.update(enrichment)
        # Fill missing contact fields from scraped contact
        scraped_contact = enrichment.get("scraped_contact") or {}
        if not property_data.get("poc_name") and scraped_contact.get("name"):
            property_data["poc_name"] = scraped_contact["name"]
        if not property_data.get("poc_number") and scraped_contact.get("phone"):
            property_data["poc_number"] = scraped_contact["phone"]
        if not property_data.get("area_name") and scraped_contact.get("address"):
            property_data["area_name"] = scraped_contact["address"]
        
        # Add scraped images to image URLs (prepend to prioritize scraped images)
        scraped_images = enrichment.get("scraped_images") or []
        if scraped_images:
            # Clean scraped image URLs and prepend to existing URLs
            cleaned_scraped = [clean_image_url(img) for img in scraped_images if clean_image_url(img)]
            image_urls = cleaned_scraped + image_urls
    
    # Get database URL for background task
    from app.core.configs.config import settings
    db_url = settings.DATABASE_URL
    
    # Schedule background task
    background_tasks.add_task(
        _generate_ppt_task,
        export.id,
        property_data,
        image_urls,
        db_url,
        template_name,
    )
    
    return PPTExportJobResponse(
        job_id=export.id,
        status=PPTExportStatusSchema.QUEUED,
        message=f"PPT generation started with '{template_name}' template. Poll the status endpoint for updates.",
    )


@router.get("/{export_id}", response_model=PPTExportResponse)
def get_ppt_export(
    export_id: UUID,
    db: Session = Depends(get_database),
):
    """Get PPT export status and details"""
    export = db.query(PPTExport).filter(PPTExport.id == export_id).first()
    
    if not export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PPT export with ID {export_id} not found"
        )
    
    return export


@router.get("/{export_id}/download")
def download_ppt(
    export_id: UUID,
    db: Session = Depends(get_database),
):
    """Download the generated PPT file"""
    export = db.query(PPTExport).filter(PPTExport.id == export_id).first()
    
    if not export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PPT export with ID {export_id} not found"
        )
    
    if export.status != PPTExportStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"PPT export is not ready. Current status: {export.status}"
        )
    
    # Get PPT from cache
    cache_key = f"ppt:file:{export_id}"
    cached_hex = get_from_cache(cache_key)
    
    if not cached_hex:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="PPT file has expired. Please generate a new one."
        )
    
    # Convert hex back to bytes
    import io
    ppt_bytes = bytes.fromhex(cached_hex)
    ppt_stream = io.BytesIO(ppt_bytes)
    
    return StreamingResponse(
        ppt_stream,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={
            "Content-Disposition": f'attachment; filename="{export.file_name}"',
            "Content-Length": str(len(ppt_bytes)),
        }
    )


@router.get("", response_model=PPTExportListResponse)
def list_ppt_exports(
    user_id: UUID = Query(..., description="User ID to filter exports"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_database),
):
    """List PPT exports for a user with pagination"""
    query = db.query(PPTExport).filter(PPTExport.user_id == user_id)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    exports = query.order_by(PPTExport.created_at.desc()).offset(offset).limit(page_size).all()
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size
    
    return PPTExportListResponse(
        items=exports,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/user/recent-activity", response_model=list[PPTExportActivityResponse])
def get_recent_ppt_activity(
    user_id: UUID = Query(..., description="User ID"),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_database),
):
    """Get recent PPT export activity for dashboard"""
    exports = (
        db.query(PPTExport, Property)
        .join(Property, PPTExport.property_id == Property.our_id)
        .filter(PPTExport.user_id == user_id)
        .order_by(PPTExport.created_at.desc())
        .limit(limit)
        .all()
    )
    
    result = []
    for export, property_obj in exports:
        result.append(PPTExportActivityResponse(
            id=export.id,
            property_id=export.property_id,
            property_title=property_obj.title,
            property_location=property_obj.area_name,
            status=PPTExportStatusSchema(export.status),
            file_url=export.file_url,
            created_at=export.created_at,
            completed_at=export.completed_at,
        ))
    
    return result


@router.delete("/{export_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ppt_export(
    export_id: UUID,
    db: Session = Depends(get_database),
):
    """Delete a PPT export record"""
    export = db.query(PPTExport).filter(PPTExport.id == export_id).first()
    
    if not export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PPT export with ID {export_id} not found"
        )
    
    # Delete from cache if exists
    cache_key = f"ppt:file:{export_id}"
    # Note: In production, also delete from cloud storage
    
    db.delete(export)
    db.commit()
    
    return None

