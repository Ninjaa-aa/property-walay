from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class PropertyPPTInput(BaseModel):
    """
    Contract for the `property_data` dict consumed by `PropertyPPTGenerator.generate()`.

    Notes:
    - Many fields are optional because your DB model allows nulls and your generator
      already has fallbacks for missing values.
    - We intentionally ignore extra keys because the API route may attach enrichment
      fields not used by the core generator.
    """

    model_config = ConfigDict(extra="ignore")

    our_id: Optional[str] = None
    title: Optional[str] = None

    prop_type: Optional[str] = None
    prop_subtype: Optional[str] = None

    area_size: Optional[float] = None
    area_unit: Optional[str] = None

    beds: Optional[int] = None
    baths: Optional[int] = None

    area_name: Optional[str] = None

    current_price: Optional[float] = None
    currency: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    source: Optional[str] = None
    source_human_id: Optional[str] = None

    poc_name: Optional[str] = None
    poc_number: Optional[str] = None

    # Scraped enrichment fields (generator treats them as optional)
    scraped_features: Optional[dict[str, list[str]]] = None
    scraped_amenities: Optional[dict[str, list[str]]] = None

