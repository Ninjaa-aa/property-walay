import json
import hashlib
import os
import time
import threading
from datetime import datetime, timezone
from typing import Dict, Any, List

from supabase import create_client, Client

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


def create_supabase_client() -> Client:
    """Create a Supabase client."""
    # Create Supabase client - timeout will be handled at the request level
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def make_our_id(source: str, source_id: str) -> str:
    payload = f"{source}:{source_id}".encode("utf-8")
    h = hashlib.sha1(payload).hexdigest()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def normalize_record(raw: Dict[str, Any], source: str) -> Dict[str, Any]:
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
    }


def load_json(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data if isinstance(data, list) else []


def get_existing_property_ids(supabase: Client) -> set:
    """Get all existing property IDs from the database to enable resume functionality."""
    try:
        result = supabase.table("properties").select("our_id").execute()
        return {row["our_id"] for row in result.data}
    except Exception as e:
        print(f"Warning: Could not fetch existing property IDs: {e}")
        return set()


# Thread-safe progress tracking
progress_lock = threading.Lock()
progress_data = {
    "successful_uploads": 0,
    "failed_uploads": 0,
    "failed_ids": [],
    "total_count": 0
}

def save_progress():
    """Save progress to a file for resume capability."""
    with progress_lock:
        progress_info = {
            "processed_count": progress_data["successful_uploads"] + progress_data["failed_uploads"],
            "total_count": progress_data["total_count"],
            "successful_uploads": progress_data["successful_uploads"],
            "failed_uploads": progress_data["failed_uploads"],
            "failed_ids": progress_data["failed_ids"].copy(),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    with open("upload_progress.json", "w", encoding="utf-8") as f:
        json.dump(progress_info, f, indent=2)


def load_progress() -> Dict[str, Any]:
    """Load progress from file if it exists."""
    if os.path.exists("upload_progress.json"):
        try:
            with open("upload_progress.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load progress file: {e}")
    return {"processed_count": 0, "total_count": 0, "failed_ids": []}


def process_batch_properties(properties: List[Dict[str, Any]]) -> Dict[str, int]:
    """Process a batch of properties with retry logic."""
    supabase = create_supabase_client()
    
    for attempt in range(MAX_RETRIES):
        try:
            result = bulk_upsert_properties(supabase, properties)
            return result
        except Exception as e:
            print(f"Batch processing attempt {attempt + 1} failed: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                print(f"All retry attempts failed for batch of {len(properties)} properties")
                return {"inserted": 0, "updated": 0, "errors": len(properties)}
    
    return {"inserted": 0, "updated": 0, "errors": len(properties)}


def bulk_upsert_properties(supabase: Client, properties: List[Dict[str, Any]]) -> Dict[str, int]:
    """Bulk upsert properties with price history tracking."""
    if not properties:
        return {"inserted": 0, "updated": 0, "errors": 0}
    
    now = datetime.now(timezone.utc).isoformat()

    # Remove duplicates within the batch to avoid "cannot affect row a second time" error
    seen_ids = set()
    unique_properties = []
    for prop in properties:
        prop_id = prop["our_id"]
        if prop_id not in seen_ids:
            seen_ids.add(prop_id)
            unique_properties.append(prop)
    
    if len(unique_properties) != len(properties):
        print(f"Removed {len(properties) - len(unique_properties)} duplicate properties from batch")
    
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
    
    # Track successful property IDs for price history
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
                        # Use upsert with on_conflict to handle existing properties
                        result = supabase.table("properties").upsert(chunk, on_conflict="our_id").execute()
                        # Track successful property IDs
                        for prop in chunk:
                            successful_property_ids.add(prop["our_id"])
                        # Count as inserted for simplicity (upsert handles both cases)
                        inserted_count += len(chunk)
                        chunk_success = True
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            print(f"Retrying property chunk {i//CHUNK_SIZE + 1} (attempt {attempt + 2}): {chunk_error}")
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"Failed property chunk {i//CHUNK_SIZE + 1} after {MAX_RETRIES} attempts: {chunk_error}")
                            error_count += len(chunk)
                
                # Small delay between chunks to reduce database load
                if i + CHUNK_SIZE < len(new_properties):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"Error bulk upserting properties: {e}")
        error_count += len(new_properties)
    
    try:
        # Bulk upsert last updates in chunks (only for successful properties)
        if last_update_entries:
            successful_updates = [entry for entry in last_update_entries if entry["our_id"] in successful_property_ids]
            for i in range(0, len(successful_updates), CHUNK_SIZE):
                chunk = successful_updates[i:i + CHUNK_SIZE]
                
                # Retry logic for each chunk
                for attempt in range(MAX_RETRIES):
                    try:
                        supabase.table("property_last_updates").upsert(chunk, on_conflict="our_id").execute()
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            print(f"Retrying last_update chunk {i//CHUNK_SIZE + 1} (attempt {attempt + 2}): {chunk_error}")
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"Failed last_update chunk {i//CHUNK_SIZE + 1} after {MAX_RETRIES} attempts: {chunk_error}")
                
                # Small delay between chunks
                if i + CHUNK_SIZE < len(successful_updates):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"Error bulk upserting last updates: {e}")
    
    try:
        # Bulk insert price history in chunks (only for successful properties)
        if price_history_entries:
            successful_price_history = [entry for entry in price_history_entries if entry["our_id"] in successful_property_ids]
            for i in range(0, len(successful_price_history), CHUNK_SIZE):
                chunk = successful_price_history[i:i + CHUNK_SIZE]
                
                # Retry logic for each chunk
                for attempt in range(MAX_RETRIES):
                    try:
                        supabase.table("property_price_history").insert(chunk).execute()
                        break
                    except Exception as chunk_error:
                        if attempt < MAX_RETRIES - 1:
                            print(f"Retrying price_history chunk {i//CHUNK_SIZE + 1} (attempt {attempt + 2}): {chunk_error}")
                            time.sleep(RETRY_DELAY)
                        else:
                            print(f"Failed price_history chunk {i//CHUNK_SIZE + 1} after {MAX_RETRIES} attempts: {chunk_error}")
                
                # Small delay between chunks
                if i + CHUNK_SIZE < len(successful_price_history):
                    time.sleep(CHUNK_DELAY)
                    
    except Exception as e:
        print(f"Error bulk inserting price history: {e}")
    
    return {
        "inserted": inserted_count,
        "updated": updated_count,
        "errors": error_count
    }


def ingest_all():
    supabase = create_supabase_client()

    lamudi_home_sale = load_json("Lamudi/Data/house_sale.json")
    lamudi_home_rent = load_json("Lamudi/Data/house_rent.json")
    lamudi_com_sale = load_json("Lamudi/Data/commercial_sale.json")
    lamudi_com_rent = load_json("Lamudi/Data/commercial_rent.json")
    lamudi_plots_sale = load_json("Lamudi/Data/plot_sale.json")

    zameen_home_sale = load_json("Zameen/Data/house_sale.json")
    zameen_home_rent = load_json("Zameen/Data/house_rent.json")
    zameen_com_sale = load_json("Zameen/Data/commercial_sale.json")
    zameen_com_rent = load_json("Zameen/Data/commercial_rent.json")
    zameen_plots_sale = load_json("Zameen/Data/plot_sale.json")

    graana_home_sale = load_json("Graana/Data/house_sale.json")
    graana_home_rent = load_json("Graana/Data/house_rent.json")
    graana_com_sale = load_json("Graana/Data/commercial_sale.json")
    graana_com_rent = load_json("Graana/Data/commercial_rent.json")
    graana_plots_sale = load_json("Graana/Data/plot_sale.json")

    unified: List[Dict[str, Any]] = []

    for rec in lamudi_home_sale + lamudi_home_rent + lamudi_com_sale + lamudi_com_rent + lamudi_plots_sale:
        unified.append(normalize_record(rec, "lamudi"))
    for rec in zameen_home_sale + zameen_home_rent + zameen_com_sale + zameen_com_rent + zameen_plots_sale:
        unified.append(normalize_record(rec, "zameen"))
    for rec in graana_home_sale + graana_home_rent + graana_com_sale + graana_com_rent + graana_plots_sale:
        unified.append(normalize_record(rec, "graana"))

    with open("unified_properties.json", "w", encoding="utf-8") as f:
        json.dump(unified, f, indent=2, ensure_ascii=False)

    # Check for existing progress and resume if possible
    existing_ids = get_existing_property_ids(supabase)
    
    # Filter out properties that already exist in the database
    properties_to_process = []
    skipped_count = 0
    
    for prop in unified:
        if prop["our_id"] in existing_ids:
            skipped_count += 1
        else:
            properties_to_process.append(prop)
    
    total_properties = len(properties_to_process)
    
    print(f"Found {len(unified)} total properties")
    print(f"Skipping {skipped_count} properties that already exist in database")
    print(f"Processing {total_properties} new properties using {MAX_WORKERS} threads...")
    
    if total_properties == 0:
        print("No new properties to upload!")
        return
    
    # Initialize progress tracking
    with progress_lock:
        progress_data["total_count"] = total_properties
        progress_data["successful_uploads"] = 0
        progress_data["failed_uploads"] = 0
        progress_data["failed_ids"] = []
    
    # Process properties in batches
    start_time = time.time()
    total_inserted = 0
    total_updated = 0
    total_errors = 0
    
    # Create batches
    batches = [properties_to_process[i:i + BATCH_SIZE] for i in range(0, len(properties_to_process), BATCH_SIZE)]
    total_batches = len(batches)
    
    print(f"Processing {total_properties} properties in {total_batches} batches of {BATCH_SIZE}...")
    
    for batch_idx, batch in enumerate(batches, 1):
        print(f"Processing batch {batch_idx}/{total_batches} ({len(batch)} properties)...")
        
        result = process_batch_properties(batch)
        
        # Update totals
        total_inserted += result["inserted"]
        total_updated += result["updated"]
        total_errors += result["errors"]
        
        # Update progress
        with progress_lock:
            progress_data["successful_uploads"] += result["inserted"] + result["updated"]
            progress_data["failed_uploads"] += result["errors"]
            
            # Add failed property IDs to the list
            if result["errors"] > 0:
                for prop in batch:
                    progress_data["failed_ids"].append(prop["our_id"])
        
        # Save progress every 10 batches
        if batch_idx % 10 == 0:
            save_progress()
            elapsed_time = time.time() - start_time
            processed_count = total_inserted + total_updated + total_errors
            rate = processed_count / elapsed_time if elapsed_time > 0 else 0
            print(f"\n--- Progress Update ---")
            print(f"Batches completed: {batch_idx}/{total_batches}")
            print(f"Properties processed: {processed_count}/{total_properties}")
            print(f"Rate: {rate:.1f} properties/second")
            print(f"Elapsed: {elapsed_time:.1f} seconds")
            print(f"ETA: {(total_properties - processed_count) / rate:.1f} seconds" if rate > 0 else "ETA: Unknown")
            print("----------------------\n")
        
        # Small delay between batches to reduce database load
        if batch_idx < total_batches:
            time.sleep(0.5)
    
    # Final progress save
    save_progress()
    
    # Final summary
    elapsed_time = time.time() - start_time
    rate = total_properties / elapsed_time if elapsed_time > 0 else 0
    
    print(f"\n=== Upload Summary ===")
    print(f"Total properties: {total_properties}")
    print(f"New properties inserted: {total_inserted}")
    print(f"Existing properties updated: {total_updated}")
    print(f"Failed uploads: {total_errors}")
    print(f"Success rate: {((total_inserted + total_updated)/total_properties)*100:.1f}%")
    print(f"Total time: {elapsed_time:.1f} seconds")
    print(f"Average rate: {rate:.1f} properties/second")
    
    if total_errors > 0:
        print(f"\n⚠️  {total_errors} properties failed to upload. You may want to run the script again to retry failed uploads.")
        print(f"Failed property IDs saved to upload_progress.json for reference.")
    
    # Clean up progress file on successful completion
    if total_errors == 0:
        try:
            os.remove("upload_progress.json")
            print("Progress file cleaned up.")
        except:
            pass


def save_property_for_user(email: str, our_id: str):
    supabase = create_supabase_client()
    supabase.table("saved_properties").upsert({
        "email": email,
        "our_id": our_id
    }, on_conflict="email,our_id").execute()


def list_saved_for_user(email: str) -> List[Dict[str, Any]]:
    supabase = create_supabase_client()
    rows = supabase.table("saved_properties").select("our_id, saved_at").eq("email", email).execute().data
    return rows


if __name__ == "__main__":
    ingest_all()


