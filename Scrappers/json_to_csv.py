import json
import csv
import os
from datetime import datetime, timezone
from typing import Dict, Any, List
import hashlib

def make_our_id(source: str, source_id: str) -> str:
    """Generate consistent our_id for properties."""
    payload = f"{source}:{source_id}".encode("utf-8")
    h = hashlib.sha1(payload).hexdigest()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def clean_value(value):
    """Clean and format values for CSV export."""
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    return str(value).replace('\n', ' ').replace('\r', ' ').strip()

def load_unified_properties(file_path: str = "unified_properties.json") -> List[Dict[str, Any]]:
    """Load the unified properties JSON file."""
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found!")
        return []
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data if isinstance(data, list) else []

def export_properties_to_csv(properties: List[Dict[str, Any]], output_file: str = "properties.csv"):
    """Export properties to CSV file."""
    if not properties:
        print("No properties to export!")
        return
    
    # Define CSV columns in the correct order
    csv_columns = [
        "our_id",
        "source", 
        "source_id",
        "source_human_id",
        "title",
        "prop_type",
        "prop_subtype", 
        "area_size",
        "area_unit",
        "beds",
        "baths",
        "area_name",
        "link",
        "images",
        "poc_name",
        "poc_number",
        "latitude",
        "longitude",
        "current_price",
        "currency",
        "created_at",
        "updated_at",
        "last_price_change_at"
    ]
    
    now = datetime.now(timezone.utc).isoformat()
    
    with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        
        for prop in properties:
            # Prepare row data
            row = {}
            for col in csv_columns:
                if col == "created_at":
                    row[col] = now
                elif col == "updated_at":
                    row[col] = now
                elif col == "last_price_change_at":
                    # Only set if there's a price
                    row[col] = now if prop.get("current_price") is not None else ""
                else:
                    row[col] = clean_value(prop.get(col, ""))
            
            writer.writerow(row)
    
    print(f"Exported {len(properties)} properties to {output_file}")

def export_price_history_to_csv(properties: List[Dict[str, Any]], output_file: str = "property_price_history.csv"):
    """Export price history to CSV file."""
    price_history_entries = []
    
    for prop in properties:
        if prop.get("current_price") is not None:
            price_history_entries.append({
                "our_id": prop["our_id"],
                "price": prop["current_price"],
                "currency": prop.get("currency", "PKR"),
                "changed_at": datetime.now(timezone.utc).isoformat()
            })
    
    if not price_history_entries:
        print("No price history entries to export!")
        return
    
    csv_columns = ["our_id", "price", "currency", "changed_at"]
    
    with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        
        for entry in price_history_entries:
            row = {col: clean_value(entry.get(col, "")) for col in csv_columns}
            writer.writerow(row)
    
    print(f"Exported {len(price_history_entries)} price history entries to {output_file}")

def export_last_updates_to_csv(properties: List[Dict[str, Any]], output_file: str = "property_last_updates.csv"):
    """Export last updates to CSV file."""
    csv_columns = ["our_id", "last_updated_at"]
    now = datetime.now(timezone.utc).isoformat()
    
    with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        
        for prop in properties:
            row = {
                "our_id": prop["our_id"],
                "last_updated_at": now
            }
            writer.writerow(row)
    
    print(f"Exported {len(properties)} last update entries to {output_file}")

def remove_duplicates(properties: List[Dict[str, Any]], dedup_by: str = "our_id") -> List[Dict[str, Any]]:
    """Remove duplicate properties based on specified field."""
    seen_values = set()
    unique_properties = []
    
    for prop in properties:
        value = prop.get(dedup_by)
        if value and value not in seen_values:
            seen_values.add(value)
            unique_properties.append(prop)
    
    removed_count = len(properties) - len(unique_properties)
    if removed_count > 0:
        print(f"Removed {removed_count} duplicate properties based on '{dedup_by}' field")
    
    return unique_properties

def get_file_size_mb(file_path: str) -> float:
    """Get file size in MB."""
    if os.path.exists(file_path):
        size_bytes = os.path.getsize(file_path)
        return size_bytes / (1024 * 1024)
    return 0

def split_csv_file(input_file: str, max_size_mb: float = 95, output_prefix: str = None):
    """Split a large CSV file into smaller chunks under max_size_mb."""
    if not os.path.exists(input_file):
        print(f"File {input_file} not found!")
        return []
    
    file_size_mb = get_file_size_mb(input_file)
    print(f"File {input_file} size: {file_size_mb:.2f} MB")
    
    if file_size_mb <= max_size_mb:
        print(f"File is already under {max_size_mb} MB, no splitting needed")
        return [input_file]
    
    if output_prefix is None:
        output_prefix = input_file.replace('.csv', '')
    
    # Read the CSV file
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # Read header
        rows = list(reader)
    
    # Calculate approximate rows per chunk
    total_rows = len(rows)
    estimated_rows_per_chunk = int((max_size_mb / file_size_mb) * total_rows * 0.9)  # 90% to be safe
    
    chunk_files = []
    current_chunk = 0
    current_rows = []
    
    for i, row in enumerate(rows):
        current_rows.append(row)
        
        # Check if we need to write a chunk
        if len(current_rows) >= estimated_rows_per_chunk or i == total_rows - 1:
            current_chunk += 1
            chunk_filename = f"{output_prefix}_part_{current_chunk}.csv"
            
            # Write chunk
            with open(chunk_filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(header)
                writer.writerows(current_rows)
            
            chunk_size_mb = get_file_size_mb(chunk_filename)
            print(f"Created {chunk_filename} with {len(current_rows)} rows ({chunk_size_mb:.2f} MB)")
            
            chunk_files.append(chunk_filename)
            current_rows = []
    
    # Remove original file if it was split
    if len(chunk_files) > 1:
        os.remove(input_file)
        print(f"Removed original file {input_file}")
    
    return chunk_files

def generate_upload_sql_scripts(properties_files, price_history_files, last_updates_files):
    """Generate SQL scripts for uploading CSV files."""
    
    # Properties table upload script
    properties_sql = "-- Upload properties from CSV files\n"
    properties_sql += "-- Make sure to replace the file paths with your actual CSV file paths\n\n"
    
    for i, file_path in enumerate(properties_files, 1):
        properties_sql += f"-- Part {i}: {file_path}\n"
        properties_sql += """COPY properties (
    our_id,
    source,
    source_id,
    source_human_id,
    title,
    prop_type,
    prop_subtype,
    area_size,
    area_unit,
    beds,
    baths,
    area_name,
    link,
    images,
    poc_name,
    poc_number,
    latitude,
    longitude,
    current_price,
    currency,
    created_at,
    updated_at,
    last_price_change_at
)
FROM '/path/to/your/""" + file_path + """'
WITH (FORMAT csv, HEADER true, DELIMITER ',');

"""
    
    properties_sql += "-- Check the upload\n"
    properties_sql += "SELECT COUNT(*) as total_properties FROM properties;\n"
    
    # Price history upload script
    price_history_sql = "-- Upload price history from CSV files\n"
    price_history_sql += "-- Make sure to replace the file paths with your actual CSV file paths\n\n"
    
    for i, file_path in enumerate(price_history_files, 1):
        price_history_sql += f"-- Part {i}: {file_path}\n"
        price_history_sql += """COPY property_price_history (
    our_id,
    price,
    currency,
    changed_at
)
FROM '/path/to/your/""" + file_path + """'
WITH (FORMAT csv, HEADER true, DELIMITER ',');

"""
    
    price_history_sql += "-- Check the upload\n"
    price_history_sql += "SELECT COUNT(*) as total_price_history FROM property_price_history;\n"
    
    # Last updates upload script
    last_updates_sql = "-- Upload last updates from CSV files\n"
    last_updates_sql += "-- Make sure to replace the file paths with your actual CSV file paths\n\n"
    
    for i, file_path in enumerate(last_updates_files, 1):
        last_updates_sql += f"-- Part {i}: {file_path}\n"
        last_updates_sql += """COPY property_last_updates (
    our_id,
    last_updated_at
)
FROM '/path/to/your/""" + file_path + """'
WITH (FORMAT csv, HEADER true, DELIMITER ',');

"""
    
    last_updates_sql += "-- Check the upload\n"
    last_updates_sql += "SELECT COUNT(*) as total_last_updates FROM property_last_updates;\n"
    
    # Write SQL scripts to files
    with open("upload_properties.sql", "w", encoding="utf-8") as f:
        f.write(properties_sql)
    
    with open("upload_price_history.sql", "w", encoding="utf-8") as f:
        f.write(price_history_sql)
    
    with open("upload_last_updates.sql", "w", encoding="utf-8") as f:
        f.write(last_updates_sql)
    
    print("Generated SQL upload scripts:")
    print("- upload_properties.sql")
    print("- upload_price_history.sql") 
    print("- upload_last_updates.sql")

def main():
    """Main function to convert JSON to CSV files."""
    print("Converting unified_properties.json to CSV files...")
    
    # Load properties
    properties = load_unified_properties()
    if not properties:
        return
    
    print(f"Loaded {len(properties)} properties from unified_properties.json")
    
    # Remove duplicates by our_id first
    properties = remove_duplicates(properties, "our_id")
    print(f"After removing our_id duplicates: {len(properties)} properties")
    
    # Remove duplicates by Link (this will remove more duplicates)
    properties = remove_duplicates(properties, "link")
    print(f"After removing link duplicates: {len(properties)} properties")
    
    # Export to CSV files
    print("\nExporting to CSV files...")
    export_properties_to_csv(properties, "properties.csv")
    export_price_history_to_csv(properties, "property_price_history.csv")
    export_last_updates_to_csv(properties, "property_last_updates.csv")
    
    # Check file sizes and split if necessary
    print("\nChecking file sizes...")
    properties_files = split_csv_file("properties.csv", max_size_mb=95)
    price_history_files = split_csv_file("property_price_history.csv", max_size_mb=95)
    last_updates_files = split_csv_file("property_last_updates.csv", max_size_mb=95)
    
    # Generate SQL upload scripts for all files
    generate_upload_sql_scripts(properties_files, price_history_files, last_updates_files)
    
    print("\n=== Export Complete ===")
    print("Generated files:")
    
    print("\nProperties files:")
    for file in properties_files:
        size_mb = get_file_size_mb(file)
        print(f"  - {file} ({size_mb:.2f} MB)")
    
    print("\nPrice history files:")
    for file in price_history_files:
        size_mb = get_file_size_mb(file)
        print(f"  - {file} ({size_mb:.2f} MB)")
    
    print("\nLast updates files:")
    for file in last_updates_files:
        size_mb = get_file_size_mb(file)
        print(f"  - {file} ({size_mb:.2f} MB)")
    
    print("\nSQL upload scripts:")
    print("  - upload_properties.sql")
    print("  - upload_price_history.sql")
    print("  - upload_last_updates.sql")
    
    print("\nNext steps:")
    print("1. Upload the CSV files to your database server")
    print("2. Update the file paths in the SQL scripts")
    print("3. Run the SQL scripts in order:")
    print("   - upload_properties.sql (first)")
    print("   - upload_price_history.sql")
    print("   - upload_last_updates.sql")

if __name__ == "__main__":
    main()
