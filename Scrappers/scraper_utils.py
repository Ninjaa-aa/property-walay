"""
Utility module for property scraping and ingestion system.
Provides functions for chunked JSON saving and optimized property comparison.
"""

import json
import os
from typing import Dict, Any, List, Optional, Tuple
from collections import defaultdict


def normalize_city_name(city_name: str) -> str:
    """
    Normalize city name for use in filenames.
    Converts to lowercase and replaces spaces/special chars with underscores.
    """
    if not city_name:
        return "unknown"
    return city_name.lower().strip().replace(" ", "_").replace("-", "_")


def determine_type_subtype(property_data: Dict[str, Any], scraper_type: str) -> Tuple[str, str]:
    """
    Determine TYPE (rent/buy) and SUBTYPE (commercial/residential/plot) from property data.
    
    Args:
        property_data: Property dictionary with Type/Subtype fields
        scraper_type: Type of scraper (e.g., 'house_rent', 'commercial_sale', 'plot_sale')
    
    Returns:
        Tuple of (type, subtype) where type is 'rent' or 'buy', subtype is 'commercial', 'residential', or 'plot'
    """
    # Determine TYPE from scraper_type
    if 'rent' in scraper_type.lower():
        prop_type = 'rent'
    else:
        prop_type = 'buy'
    
    # Determine SUBTYPE from scraper_type or property data
    if 'plot' in scraper_type.lower():
        subtype = 'plot'
    elif 'commercial' in scraper_type.lower():
        subtype = 'commercial'
    else:
        subtype = 'residential'
    
    # Override with property data if available
    prop_type_field = property_data.get('Type', '').lower()
    subtype_field = property_data.get('Subtype', '').lower()
    
    if 'rent' in prop_type_field:
        prop_type = 'rent'
    elif 'sale' in prop_type_field or 'buy' in prop_type_field:
        prop_type = 'buy'
    
    if 'plot' in subtype_field:
        subtype = 'plot'
    elif 'commercial' in subtype_field:
        subtype = 'commercial'
    elif 'residential' in subtype_field or 'house' in subtype_field or 'home' in subtype_field:
        subtype = 'residential'
    
    return prop_type, subtype


def extract_city_from_property(property_data: Dict[str, Any]) -> str:
    """
    Extract city name from property data.
    Looks in 'Area Name' field which typically contains "Area, City" format.
    """
    area_name = property_data.get('Area Name', '')
    if not area_name:
        return 'unknown'
    
    # Try to extract city from "Area, City" format
    parts = [p.strip() for p in area_name.split(',')]
    if len(parts) > 1:
        # Last part is usually the city
        return parts[-1]
    elif len(parts) == 1:
        return parts[0]
    
    return 'unknown'


def save_chunked_json(
    properties: List[Dict[str, Any]],
    website: str,
    scraper_type: str,
    data_dir: str = None
) -> List[str]:
    """
    Save properties in chunks grouped by city.
    Each chunk is saved as: WEBSITE_CITY_TYPE_SUBTYPE.json
    
    Args:
        properties: List of property dictionaries
        website: Website name (graana/lamudi/zameen)
        scraper_type: Type of scraper (e.g., 'house_rent', 'commercial_sale')
        data_dir: Directory to save JSON files (defaults to Website/Data)
    
    Returns:
        List of file paths where chunks were saved
    """
    if not properties:
        return []
    
    # Determine data directory
    if data_dir is None:
        data_dir = os.path.join(website.capitalize(), "Data")
    
    # Ensure directory exists
    os.makedirs(data_dir, exist_ok=True)
    
    # Group properties by city
    city_groups = defaultdict(list)
    for prop in properties:
        city = extract_city_from_property(prop)
        city_groups[city].append(prop)
    
    # Determine TYPE and SUBTYPE
    prop_type, subtype = determine_type_subtype(properties[0] if properties else {}, scraper_type)
    
    # Save each city group as a separate chunk
    saved_files = []
    for city, city_properties in city_groups.items():
        normalized_city = normalize_city_name(city)
        filename = f"{website.lower()}_{normalized_city}_{prop_type}_{subtype}.json"
        filepath = os.path.join(data_dir, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(city_properties, f, indent=2, ensure_ascii=False)
            saved_files.append(filepath)
            print(f"Saved {len(city_properties)} properties to {filepath}")
        except Exception as e:
            print(f"Error saving {filepath}: {e}")
    
    return saved_files


def load_chunked_json(filepath: str) -> List[Dict[str, Any]]:
    """
    Load properties from a chunked JSON file.
    
    Args:
        filepath: Path to the JSON file
    
    Returns:
        List of property dictionaries
    """
    if not os.path.exists(filepath):
        return []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []


def get_property_id(property_data: Dict[str, Any]) -> str:
    """
    Extract property ID from property data.
    Uses 'ID' field as the unique identifier.
    """
    return str(property_data.get('ID', ''))


def binary_search_property_id(property_id: str, sorted_properties: List[Dict[str, Any]]) -> Optional[int]:
    """
    Binary search for a property ID in a sorted list of properties.
    Properties must be sorted by ID for this to work correctly.
    
    Args:
        property_id: The property ID to search for
        sorted_properties: List of property dictionaries sorted by ID
    
    Returns:
        Index of the property if found, None otherwise
    """
    if not sorted_properties:
        return None
    
    # Extract IDs for comparison
    ids = [get_property_id(prop) for prop in sorted_properties]
    
    # Binary search
    left, right = 0, len(ids) - 1
    while left <= right:
        mid = (left + right) // 2
        if ids[mid] == property_id:
            return mid
        elif ids[mid] < property_id:
            left = mid + 1
        else:
            right = mid - 1
    
    return None


def compare_properties_optimized(
    old_properties: List[Dict[str, Any]],
    new_properties: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Compare old and new properties using binary search for O(n log n) complexity.
    
    Args:
        old_properties: List of old property dictionaries
        new_properties: List of new property dictionaries
    
    Returns:
        Tuple of (new_properties_list, sold_property_ids)
        - new_properties_list: Properties that are new (not in old list)
        - sold_property_ids: Property IDs that were in old but not in new
    """
    # Sort both lists by property ID for binary search
    old_sorted = sorted(old_properties, key=lambda p: get_property_id(p))
    new_sorted = sorted(new_properties, key=lambda p: get_property_id(p))
    
    # Find new properties (in new but not in old)
    new_props = []
    for prop in new_sorted:
        prop_id = get_property_id(prop)
        if binary_search_property_id(prop_id, old_sorted) is None:
            new_props.append(prop)
    
    # Find sold properties (in old but not in new)
    sold_ids = []
    for prop in old_sorted:
        prop_id = get_property_id(prop)
        if binary_search_property_id(prop_id, new_sorted) is None:
            sold_ids.append(prop_id)
    
    return new_props, sold_ids


def find_all_chunked_json_files(base_dir: str = ".") -> List[str]:
    """
    Find all chunked JSON files matching the pattern WEBSITE_CITY_TYPE_SUBTYPE.json
    
    Args:
        base_dir: Base directory to search from
    
    Returns:
        List of file paths matching the pattern
    """
    chunked_files = []
    
    # Search in website Data directories
    websites = ['Graana', 'Lamudi', 'Zameen']
    for website in websites:
        data_dir = os.path.join(base_dir, website, 'Data')
        if os.path.exists(data_dir):
            for filename in os.listdir(data_dir):
                # Check if filename matches pattern: website_city_type_subtype.json
                if filename.endswith('.json') and '_' in filename:
                    parts = filename.replace('.json', '').split('_')
                    if len(parts) >= 4:  # website, city, type, subtype
                        filepath = os.path.join(data_dir, filename)
                        chunked_files.append(filepath)
    
    return chunked_files


def parse_chunk_filename(filepath: str) -> Dict[str, str]:
    """
    Parse a chunked JSON filename to extract website, city, type, and subtype.
    
    Args:
        filepath: Path to the chunked JSON file
    
    Returns:
        Dictionary with keys: website, city, type, subtype
    """
    filename = os.path.basename(filepath).replace('.json', '')
    parts = filename.split('_')
    
    if len(parts) >= 4:
        return {
            'website': parts[0],
            'city': parts[1],
            'type': parts[2],
            'subtype': parts[3]
        }
    
    return {
        'website': 'unknown',
        'city': 'unknown',
        'type': 'unknown',
        'subtype': 'unknown'
    }

