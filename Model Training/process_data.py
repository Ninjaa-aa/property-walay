"""
Property data processing for recommender training.
Reads scraper JSON from Scrappers/{Graana,Lamudi,Zameen}/Data — no .env required.
"""

import argparse
import json
import re
import warnings
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from training_utils import (
    DEFAULT_OUTPUT_DIR,
    DEFAULT_SCRAPERS_DIR,
    ensure_output_dirs,
    source_data_dirs,
)

warnings.filterwarnings("ignore")


class PropertyDataProcessor:
    """Merge scraper JSON into a unified CSV for ML training."""

    def __init__(self, scrapers_dir: Path, output_dir: Path):
        self.scrapers_dir = Path(scrapers_dir)
        self.output_dir = Path(output_dir)
        self.data: List[Dict[str, Any]] = []
        self.area_conversions = {
            "marla": 25.2929,
            "kanal": 505.857,
            "sqft": 0.092903,
            "sq": 0.836127,
            "sqm": 1.0,
        }

    def load_json_file(self, filepath: Path) -> List[Dict]:
        try:
            with open(filepath, encoding="utf-8") as f:
                data = json.load(f)
            print(f"[OK] Loaded {len(data):,} records from {filepath.name}")
            return data
        except Exception as e:
            print(f"[ERROR] Error loading {filepath.name}: {e}")
            return []

    def parse_price(self, price: Any) -> float:
        if pd.isna(price) or price == "" or price is None:
            return np.nan
        if isinstance(price, (int, float)):
            return float(price)

        price_str = str(price).strip().upper()
        if "CRORE" in price_str or "CR" in price_str:
            match = re.search(r"([\d.]+)\s*(?:CRORE|CR)", price_str)
            if match:
                return float(match.group(1)) * 10_000_000
        if "LAKH" in price_str or "LAC" in price_str:
            match = re.search(r"([\d.]+)\s*(?:LAKH|LAC)", price_str)
            if match:
                return float(match.group(1)) * 100_000
        try:
            return float(price_str.replace(",", ""))
        except ValueError:
            return np.nan

    def standardize_area(self, area_size: Any, area_unit: str) -> float:
        if pd.isna(area_size) or area_size == "" or area_size is None:
            return np.nan
        try:
            size = float(str(area_size).replace(",", ""))
        except ValueError:
            return np.nan

        unit = str(area_unit).lower().strip()
        for key, factor in self.area_conversions.items():
            if key in unit:
                return size * factor
        return size

    def extract_location_parts(self, area_name: str) -> Dict[str, str]:
        if pd.isna(area_name) or area_name == "":
            return {"city": "", "locality": ""}
        parts = [p.strip() for p in str(area_name).split(",")]
        if len(parts) >= 2:
            return {"locality": parts[0], "city": parts[-1]}
        return {"locality": parts[0] if parts else "", "city": ""}

    def process_record(self, record: Dict, source: str, filename: str = "") -> Dict:
        price = self.parse_price(record.get("Price"))
        area_sqm = self.standardize_area(
            record.get("Area Size"), record.get("Area Unit", "sqm")
        )
        location = self.extract_location_parts(record.get("Area Name", ""))

        listing_type = ""
        property_category = ""
        if filename:
            fn = filename.lower()
            if "rent" in fn:
                listing_type = "rent"
            elif "sale" in fn:
                listing_type = "sale"
            if "commercial" in fn:
                property_category = "commercial"
            elif "house" in fn or "plot" in fn:
                property_category = "residential"

        images = record.get("Images", [])
        image_count = len(images) if isinstance(images, list) else 0
        first_image = str(images[0]).lstrip("@") if image_count else ""

        try:
            beds = int(record.get("Beds", 0))
        except (TypeError, ValueError):
            beds = 0
        try:
            baths = int(record.get("Baths", 0))
        except (TypeError, ValueError):
            baths = 0

        lat = record.get("Latitude", np.nan)
        lon = record.get("Longitude", np.nan)
        try:
            lat = float(lat) if lat and lat != "" else np.nan
            lon = float(lon) if lon and lon != "" else np.nan
        except (TypeError, ValueError):
            lat, lon = np.nan, np.nan

        price_per_sqm = (
            price / area_sqm if price and area_sqm and area_sqm > 0 else np.nan
        )

        return {
            "id": record.get("ID"),
            "source": source,
            "listing_type": listing_type,
            "property_category": property_category,
            "url": record.get("Link", ""),
            "title": record.get("Custom Title", ""),
            "type": record.get("Type", ""),
            "subtype": record.get("Subtype", ""),
            "price_pkr": price,
            "area_sqm": area_sqm,
            "area_original": record.get("Area Size"),
            "area_unit_original": record.get("Area Unit"),
            "beds": beds,
            "baths": baths,
            "city": location["city"],
            "locality": location["locality"],
            "area_name": record.get("Area Name", ""),
            "latitude": lat,
            "longitude": lon,
            "price_per_sqm": price_per_sqm,
            "image_count": image_count,
            "first_image_url": first_image,
            "poc_name": record.get("Name of POC", ""),
            "poc_number": record.get("Number of POC", ""),
            "has_geolocation": not (pd.isna(lat) or pd.isna(lon)),
            "has_contact": bool(str(record.get("Number of POC", "")).strip()),
        }

    def load_all_data(self) -> List[Dict]:
        all_records: List[Dict] = []
        for source_name, source_path in source_data_dirs(self.scrapers_dir).items():
            print(f"\n>> Processing {source_name}...")
            if not source_path.exists():
                print(f"   [WARNING] Path not found: {source_path}")
                continue
            for json_file in sorted(source_path.glob("*.json")):
                records = self.load_json_file(json_file)
                for record in records:
                    all_records.append(
                        self.process_record(record, source_name, json_file.stem)
                    )
        self.data = all_records
        print(f"\n[OK] Total records loaded: {len(all_records):,}")
        return all_records

    def deduplicate(self, df: pd.DataFrame) -> pd.DataFrame:
        print("\n>> Deduplicating data...")
        print(f"   Records before: {len(df):,}")
        df_with_url = df[df["url"].notna() & (df["url"] != "")].copy()
        print(f"   Records with URL: {len(df_with_url):,}")
        df_dedup = df_with_url.drop_duplicates(subset=["url"], keep="first")
        print(f"   Records after deduplication: {len(df_dedup):,}")
        print(f"   Duplicates removed: {len(df_with_url) - len(df_dedup):,}")
        return df_dedup

    def generate_report(self, df: pd.DataFrame) -> str:
        report = [
            "=" * 70,
            "DATA QUALITY REPORT",
            "=" * 70,
            f"\nDATASET OVERVIEW",
            f"   Total Records: {len(df):,}",
            f"   Sources: {df['source'].nunique()}",
            f"   Property Types: {df['type'].nunique()}",
            f"   Property Subtypes: {df['subtype'].nunique()}",
            f"   Cities: {df['city'].nunique()}",
        ]
        geo_count = int(df["has_geolocation"].sum())
        geo_pct = (geo_count / len(df)) * 100 if len(df) else 0
        report.extend(
            [
                f"\nGEOLOCATION",
                f"   Records with Lat/Lon: {geo_count:,} ({geo_pct:.1f}%)",
                f"   Records without Lat/Lon: {len(df) - geo_count:,}",
            ]
        )

        valid_prices = df[df["price_pkr"].notna()]
        if len(valid_prices) > 0:
            report.extend(
                [
                    f"\nPRICE STATISTICS",
                    f"   Valid Prices: {len(valid_prices):,}",
                    f"   Min Price: PKR {valid_prices['price_pkr'].min():,.0f}",
                    f"   Max Price: PKR {valid_prices['price_pkr'].max():,.0f}",
                    f"   Mean Price: PKR {valid_prices['price_pkr'].mean():,.0f}",
                    f"   Median Price: PKR {valid_prices['price_pkr'].median():,.0f}",
                ]
            )

        valid_area = df[df["area_sqm"].notna()]
        if len(valid_area) > 0:
            report.extend(
                [
                    f"\nAREA STATISTICS",
                    f"   Valid Areas: {len(valid_area):,}",
                    f"   Min Area: {valid_area['area_sqm'].min():.2f} sqm",
                    f"   Max Area: {valid_area['area_sqm'].max():.2f} sqm",
                    f"   Mean Area: {valid_area['area_sqm'].mean():.2f} sqm",
                ]
            )

        report.append(f"\nPROPERTY BREAKDOWN BY SOURCE")
        for source, count in df["source"].value_counts().items():
            report.append(f"   {source}: {count:,}")

        report.append(f"\nMISSING VALUES")
        for col in ["price_pkr", "area_sqm", "latitude", "longitude"]:
            if col in df.columns:
                missing = df[col].isna().sum()
                pct = (missing / len(df)) * 100 if len(df) else 0
                report.append(f"   {col}: {missing:,} ({pct:.1f}%)")

        report.append("\n" + "=" * 70)
        return "\n".join(report)

    def process_and_export(
        self, output_file: str = "property_data_processed.csv"
    ) -> pd.DataFrame:
        print(">> Starting Data Processing Pipeline...\n")
        self.load_all_data()
        if not self.data:
            raise FileNotFoundError(
                "No scraper JSON found. Run Scrappers first, e.g. "
                f"python ../Scrappers/run_all.py"
            )

        df = self.deduplicate(pd.DataFrame(self.data))
        report = self.generate_report(df)
        print(report)

        self.output_dir.mkdir(parents=True, exist_ok=True)
        csv_path = self.output_dir / output_file
        report_path = csv_path.with_name(csv_path.stem + "_report.txt")

        report_path.write_text(report, encoding="utf-8")
        df.to_csv(csv_path, index=False, encoding="utf-8")
        print(f"\n>> Report saved to: {report_path}")
        print(f"[OK] Data exported to: {csv_path}")
        print(f"   Total records: {len(df):,}")
        return df


def main() -> None:
    parser = argparse.ArgumentParser(description="Process scraper JSON for ML training.")
    parser.add_argument(
        "--scrapers-dir",
        type=Path,
        default=DEFAULT_SCRAPERS_DIR,
        help="Path to Scrappers folder (contains Graana/Data, etc.).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Directory for processed CSV and report.",
    )
    args = parser.parse_args()
    ensure_output_dirs()
    processor = PropertyDataProcessor(args.scrapers_dir, args.output_dir)
    processor.process_and_export("property_data_processed.csv")
    print("\n>> PROCESSING COMPLETE — ready for train_recommenders.py")


if __name__ == "__main__":
    main()
