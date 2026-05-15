"""
Optimized Supabase ingestion script with chunked JSON comparison.
Compares new JSON chunks with old ones, inserts new properties, and marks sold properties.
Uses binary search for O(n log n) property comparison.
"""

import json
import hashlib
import os
import time
import threading
import shutil
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path

from supabase import create_client, Client

# Import utility functions
from scraper_utils import (
    load_chunked_json,
    find_all_chunked_json_files,
    parse_chunk_filename,
    compare_properties_optimized,
    get_property_id
)

# ENV
SUPABASE_URL = (
    "https://jicaojwemqdwzznvmujy.supabase.co"
)
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2FvandlbXFkd3p6bnZtdWp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ5NzcwMSwiZXhwIjoyMDc2MDczNzAxfQ.z9-1Hdc-JBkSow-S7rTcp0m2v0qq8cCD6f3l3fiddnU"
)
CURRENCY_DEFAULT = "PKR"

# Configuration for robust uploads
BATCH_SIZE = 5000  # Process properties in batches
CHUNK_SIZE = 50  # Chunk size for database operations to avoid URL/payload limits
MAX_RETRIES = 3  # Maximum retry attempts for failed uploads
RETRY_DELAY = 2  # Delay between retries in seconds
TIMEOUT_SECONDS = 60  # Request timeout in seconds
MAX_WORKERS = 50  # Number of concurrent threads
CHUNK_DELAY = 0.1  # Small delay between chunks to reduce database load

# Directory to store old JSON chunks for comparison
OLD_CHUNKS_DIR = "old_chunks"


def create_supabase_client() -> Client:
    """Create a Supabase client."""
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def clear_all_tables(supabase: Client) -> None:
    """
    Remove all data from Supabase tables (child tables first due to FK constraints).
    Order: property_price_history -> property_last_updates -> saved_properties -> properties.
    """
    print("Clearing all tables in Supabase...")
    batch_size = 500
    total_deleted = 0

    while True:
        result = supabase.table("properties").select("our_id").limit(batch_size).execute()
        ids = [row["our_id"] for row in result.data]
        if not ids:
            break

        try:
            supabase.table("property_price_history").delete().in_("our_id", ids).execute()
        except Exception as e:
            print(f"  Warning deleting price_history batch: {e}")
        try:
            supabase.table("property_last_updates").delete().in_("our_id", ids).execute()
        except Exception as e:
            print(f"  Warning deleting last_updates batch: {e}")
        try:
            supabase.table("saved_properties").delete().in_("our_id", ids).execute()
        except Exception as e:
            print(f"  Warning deleting saved_properties batch: {e}")
        try:
            supabase.table("properties").delete().in_("our_id", ids).execute()
        except Exception as e:
            print(f"  Warning deleting properties batch: {e}")

        total_deleted += len(ids)
        print(f"  Cleared {total_deleted} properties...")

    print("All tables cleared.")


def make_our_id(source: str, source_id: str) -> str:
    """Generate consistent property ID from source and source_id."""
    payload = f"{source}:{source_id}".encode("utf-8")
    h = hashlib.sha1(payload).hexdigest()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def normalize_record(raw: Dict[str, Any], source: str, listing_type: str) -> Dict[str, Any]:
    """Normalize property record for database insertion. listing_type is 'rent' or 'sale'."""
    source_id = str(raw.get("ID", "")).strip()
    our_id = make_our_id(source, source_id)

    price_raw = raw.get("Price")
    try:
        price_num = float(str(price_raw).replace(",", "").strip()) if price_raw not in (None, "") else None
    except Exception:
        price_num = None

    def to_float(val):
        s = str(val).strip()
        if s in ("", "None", "null"):
            return None
        try:
            return float(s)
        except Exception:
            return None

    def to_int(val):
        s = str(val).strip()
        if s.isdigit():
            return int(s)
        return None

    return {
        "our_id": our_id,
        "source": source,
        "source_id": source_id,
        "source_human_id": f"{source.capitalize()}_{source_id}" if source_id else None,
        "title": raw.get("Custom Title"),
        "prop_type": raw.get("Type"),
        "prop_subtype": raw.get("Subtype"),
        "area_size": to_float(raw.get("Area Size")),
        "area_unit": raw.get("Area Unit"),
        "beds": to_int(raw.get("Beds")),
        "baths": to_int(raw.get("Baths")),
        "area_name": raw.get("Area Name"),
        "link": raw.get("Link"),
        "images": raw.get("Images") or [],
        "poc_name": raw.get("Name of POC"),
        "poc_number": raw.get("Number of POC"),
        "latitude": to_float(raw.get("Latitude")),
        "longitude": to_float(raw.get("Longitude")),
        "current_price": price_num,
        "currency": CURRENCY_DEFAULT,
        "listing_type": listing_type,
    }


def backup_old_chunks():
    """Backup current chunked JSON files to old_chunks directory for comparison."""
    print("Backing up current chunks for comparison...")
    
    # Create old_chunks directory
    os.makedirs(OLD_CHUNKS_DIR, exist_ok=True)
    
    # Find all current chunked files
    current_chunks = find_all_chunked_json_files()
    
    # Copy to old_chunks directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_count = 0
    
    for chunk_file in current_chunks:
        try:
            # Create relative path structure in backup
            rel_path = os.path.relpath(chunk_file)
            backup_path = os.path.join(OLD_CHUNKS_DIR, timestamp, rel_path)
            backup_dir = os.path.dirname(backup_path)
            os.makedirs(backup_dir, exist_ok=True)
            
            shutil.copy2(chunk_file, backup_path)
            backup_count += 1
        except Exception as e:
            print(f"Warning: Could not backup {chunk_file}: {e}")
    
    print(f"Backed up {backup_count} chunk files to {OLD_CHUNKS_DIR}/{timestamp}/")
    return os.path.join(OLD_CHUNKS_DIR, timestamp)


def find_old_chunk_for_comparison(new_chunk_path: str, old_chunks_base: str) -> Optional[str]:
    """Find the corresponding old chunk file for a new chunk."""
    if not old_chunks_base or not os.path.exists(old_chunks_base):
        return None
    
    # Get the filename (e.g., graana_islamabad_rent_residential.json)
    filename = os.path.basename(new_chunk_path)
    
    # Look for the same filename in old chunks
    old_chunk_path = os.path.join(old_chunks_base, filename)
    
    # Also try with relative path structure
    if not os.path.exists(old_chunk_path):
        # Try to find in subdirectories
        for root, dirs, files in os.walk(old_chunks_base):
            if filename in files:
                old_chunk_path = os.path.join(root, filename)
                break
        else:
            return None
    
    return old_chunk_path if os.path.exists(old_chunk_path) else None


def mark_properties_as_sold(supabase: Client, sold_property_ids: List[str], source: str):
    """
    Mark properties as sold in the database.
    Note: This requires a 'sold_at' or 'status' field in the properties table.
    For now, we'll update a custom field or add a note.
    """
    if not sold_property_ids:
        return 0
    
    # Convert source IDs to our_ids
    our_ids_to_mark = []
    for source_id in sold_property_ids:
        our_id = make_our_id(source, source_id)
        our_ids_to_mark.append(our_id)
    
    # Update properties - using a custom approach
    # If you have a 'sold_at' field, uncomment the following:
    # now = datetime.now(timezone.utc).isoformat()
    # for our_id in our_ids_to_mark:
    #     try:
    #         supabase.table("properties").update({"sold_at": now}).eq("our_id", our_id).execute()
    #     except Exception as e:
    #         print(f"Error marking property {our_id} as sold: {e}")
    
    # For now, we'll just log the sold properties
    # You can add a 'sold_at' timestamp field to your schema if needed
    print(f"  Found {len(our_ids_to_mark)} sold properties (would be marked if schema supports it)")
    
    return len(our_ids_to_mark)


def bulk_upsert_properties(supabase: Client, properties: List[Dict[str, Any]]) -> Dict[str, int]:
    """Bulk upsert properties with price history tracking."""
    if not properties:
        return {"inserted": 0, "updated": 0, "errors": 0}
    
    now = datetime.now(timezone.utc).isoformat()

    # Remove duplicates within the batch
    seen_ids = set()
    unique_properties = []
    for prop in properties:
        prop_id = prop["our_id"]
        if prop_id not in seen_ids:
            seen_ids.add(prop_id)
            unique_properties.append(prop)
    
    if len(unique_properties) != len(properties):
        print(f"  Removed {len(properties) - len(unique_properties)} duplicate properties from batch")
    
    # Prepare data for upsert
    new_properties = []
    price_history_entries = []
    last_update_entries = []
    
    for prop in unique_properties:
        prop_id = prop["our_id"]
        new_prop = {**prop, "updated_at": now}
        new_properties.append(new_prop)
        last_update_entries.append({
            "our_id": prop_id,
            "last_updated_at": now
        })
        if prop.get("current_price") is not None:
            price_history_entries.append({
                "our_id": prop_id,
                "price": prop["current_price"],
                "currency": prop.get("currency"),
                "changed_at": now
            })
    
    # Perform bulk operations
    inserted_count = 0
    updated_count = 0
    error_count = 0
    successful_property_ids = set()
    
    try:
        # Use upsert to handle both new and existing properties
        if new_properties:
            for i in range(0, len(new_properties), CHUNK_SIZE):
                chunk = new_properties[i:i + CHUNK_SIZE]
                chunk_success = False
                
                # Retry logic for each chunk
                for attempt in range(MAX_RETRIES):
                    try:
                        result = supabase.table("properties").upsert(chunk, on_conflict="our_id").execute()
                        for prop in chunk:
                            successful_property_ids.add(prop["our_id"])
                        inserted_count += len(chunk)
                        chunk_success = True
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"  Failed property chunk {i//CHUNK_SIZE + 1} after {MAX_RETRIES} attempts: {chunk_error}")
                            error_count += len(chunk)
                
                if i + CHUNK_SIZE < len(new_properties):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"  Error bulk upserting properties: {e}")
        error_count += len(new_properties)
    
    try:
        # Bulk upsert last updates
        if last_update_entries:
            successful_updates = [entry for entry in last_update_entries if entry["our_id"] in successful_property_ids]
            for i in range(0, len(successful_updates), CHUNK_SIZE):
                chunk = successful_updates[i:i + CHUNK_SIZE]
                for attempt in range(MAX_RETRIES):
                    try:
                        supabase.table("property_last_updates").upsert(chunk, on_conflict="our_id").execute()
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"  Failed last_update chunk: {chunk_error}")
                
                if i + CHUNK_SIZE < len(successful_updates):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"  Error bulk upserting last updates: {e}")
    
    try:
        # Bulk insert price history
        if price_history_entries:
            successful_price_history = [entry for entry in price_history_entries if entry["our_id"] in successful_property_ids]
            for i in range(0, len(successful_price_history), CHUNK_SIZE):
                chunk = successful_price_history[i:i + CHUNK_SIZE]
                for attempt in range(MAX_RETRIES):
                    try:
                        supabase.table("property_price_history").insert(chunk).execute()
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"  Failed price_history chunk: {chunk_error}")
                
                if i + CHUNK_SIZE < len(successful_price_history):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"  Error bulk inserting price history: {e}")
    
    return {
        "inserted": inserted_count,
        "updated": updated_count,
        "errors": error_count
    }


def get_existing_property_ids_from_db(supabase: Client, source: str, limit: int = None) -> set:
    """Get existing property IDs from database for a specific source."""
    try:
        query = supabase.table("properties").select("our_id").eq("source", source)
        if limit:
            query = query.limit(limit)
        result = query.execute()
        return {row["our_id"] for row in result.data}
    except Exception as e:
        print(f"  Warning: Could not fetch existing property IDs from DB: {e}")
        return set()


def process_chunk_file(chunk_file: str, old_chunks_base: Optional[str], supabase: Client) -> Dict[str, int]:
    """
    Process a single chunk file: compare with old chunk, insert new properties, mark sold.
    
    IMPORTANT: Always upserts all properties from new chunks to database.
    Chunk comparison is only used for detecting sold properties.
    
    Returns:
        Dictionary with counts: inserted, updated, sold, errors
    """
    print(f"\nProcessing chunk: {os.path.basename(chunk_file)}")
    
    # Parse chunk filename to get source and listing_type (rent/sale from folder/filename: _rent -> rent, _sale/buy -> sale)
    chunk_info = parse_chunk_filename(chunk_file)
    source = chunk_info['website']
    type_from_name = (chunk_info.get('type') or '').lower()
    listing_type = 'rent' if type_from_name == 'rent' else 'sale'
    
    # Load new chunk
    new_properties = load_chunked_json(chunk_file)
    if not new_properties:
        print(f"  No properties found in {chunk_file}")
        return {"inserted": 0, "updated": 0, "sold": 0, "errors": 0}
    
    print(f"  Loaded {len(new_properties)} properties from new chunk")
    
    # Normalize ALL properties from new chunk for database insertion
    # (We always upsert all properties - upsert handles existing ones)
    normalized_all = []
    for prop in new_properties:
        try:
            normalized = normalize_record(prop, source, listing_type)
            normalized_all.append(normalized)
        except Exception as e:
            print(f"  Error normalizing property: {e}")
            continue
    
    print(f"  Normalized {len(normalized_all)} properties for database upsert")
    
    # Always upsert all properties (upsert handles both new and existing)
    inserted = 0
    updated = 0
    errors = 0
    
    if normalized_all:
        result = bulk_upsert_properties(supabase, normalized_all)
        inserted = result["inserted"]
        updated = result["updated"]
        errors = result["errors"]
        print(f"  Upserted to database: {inserted} properties (new + updated), Errors: {errors}")
    
    # Find and load old chunk for sold property detection
    old_chunk_path = find_old_chunk_for_comparison(chunk_file, old_chunks_base) if old_chunks_base else None
    old_properties = []
    sold_property_ids = []
    
    if old_chunk_path and os.path.exists(old_chunk_path):
        old_properties = load_chunked_json(old_chunk_path)
        print(f"  Found old chunk with {len(old_properties)} properties for sold detection")
        
        # Compare to detect sold properties (in old but not in new)
        if old_properties:
            _, sold_property_ids = compare_properties_optimized(old_properties, new_properties)
            print(f"  Sold detection: {len(sold_property_ids)} properties found in old chunk but not in new")
    else:
        print(f"  No old chunk found for sold detection (first run or new chunk)")
    
    # Mark sold properties
    sold_count = 0
    if sold_property_ids:
        sold_count = mark_properties_as_sold(supabase, sold_property_ids, source)
    
    return {
        "inserted": inserted,
        "updated": updated,
        "sold": sold_count,
        "errors": errors
    }


def ingest_all():
    """Main ingestion function: clear tables, then process all chunked JSON files."""
    print("=" * 80)
    print("SUPABASE INGESTION - CHUNKED JSON PROCESSING")
    print("=" * 80)
    
    supabase = create_supabase_client()
    
    # Clear all existing data before ingesting new data
    clear_all_tables(supabase)
    
    # Backup current chunks before processing (for next run's sold detection)
    old_chunks_base = backup_old_chunks()
    
    # Find all chunked JSON files
    chunk_files = find_all_chunked_json_files()
    
    if not chunk_files:
        print("No chunked JSON files found!")
        return
    
    print(f"\nFound {len(chunk_files)} chunk files to process")
    
    # Process each chunk
    total_stats = {
        "inserted": 0,
        "updated": 0,
        "sold": 0,
        "errors": 0,
        "chunks_processed": 0
    }
    
    start_time = time.time()
    
    for chunk_file in chunk_files:
        try:
            stats = process_chunk_file(chunk_file, old_chunks_base, supabase)
            total_stats["inserted"] += stats["inserted"]
            total_stats["updated"] += stats["updated"]
            total_stats["sold"] += stats["sold"]
            total_stats["errors"] += stats["errors"]
            total_stats["chunks_processed"] += 1
        except Exception as e:
            print(f"  Error processing {chunk_file}: {e}")
            total_stats["errors"] += 1
    
    elapsed_time = time.time() - start_time
    
    # Print summary
    print("\n" + "=" * 80)
    print("INGESTION SUMMARY")
    print("=" * 80)
    print(f"Chunks processed: {total_stats['chunks_processed']}/{len(chunk_files)}")
    print(f"Properties inserted/updated: {total_stats['inserted']}")
    print(f"Properties marked as sold: {total_stats['sold']}")
    print(f"Errors: {total_stats['errors']}")
    print(f"Total time: {elapsed_time:.2f} seconds")
    print("=" * 80)


if __name__ == "__main__":
    ingest_all()

