"""
Image utility helpers shared across services.
"""

from typing import Optional


def clean_image_url(url: str) -> Optional[str]:
    """
    Clean and validate an image URL.

    - Strips whitespace and any leading '@' symbols (some scrapers prefix URLs).
    - Accepts only absolute HTTP(S) URLs.
    - Returns None for invalid or empty inputs.
    """
    if not url or not isinstance(url, str):
        return None

    cleaned = url.strip()

    # Remove any leading '@' characters that may be present
    while cleaned.startswith("@"):
        cleaned = cleaned[1:].strip()

    # Only allow absolute HTTP(S) URLs
    if cleaned.startswith("http://") or cleaned.startswith("https://"):
        return cleaned

    return None

