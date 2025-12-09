"""
Lightweight scrapers to enrich property data for PPT generation.
Uses async httpx + BeautifulSoup to fetch missing contact/amenity details.
"""
from __future__ import annotations

import json
from typing import Any, Dict, Optional, Tuple

import httpx
from bs4 import BeautifulSoup


async def _fetch_html(url: str, timeout: int = 12) -> Optional[str]:
    """Fetch page HTML with a short timeout."""
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.text
    except httpx.HTTPError:
        return None


def _safe_bool_dict(obj: Optional[dict]) -> Dict[str, bool]:
    return {k: bool(v) for k, v in (obj or {}).items()}


def _format_phone(raw: Optional[str]) -> Optional[str]:
    """Prefix Pakistani country code when missing."""
    if not raw:
        return None
    phone = str(raw).strip()
    if phone.startswith("+"):
        return phone
    if phone.startswith("92"):
        return f"+{phone}"
    phone = phone.lstrip("0")
    return f"+92{phone}"


async def fetch_graana_details(url: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Fetch a Graana property page and extract contact + feature details.
    Returns (data, error_message)
    """
    html = await _fetch_html(url)
    if not html:
        return None, "Failed to fetch Graana page"

    soup = BeautifulSoup(html, "html.parser")
    script = soup.find("script", id="__NEXT_DATA__", type="application/json")
    if not script or not script.string:
        return None, "Graana __NEXT_DATA__ not found"

    try:
        data = json.loads(script.string)
    except json.JSONDecodeError:
        return None, "Graana JSON parse failed"

    props = data.get("props", {}).get("pageProps", {}).get("data", {}) or {}
    if not props:
        return None, "Graana listing data missing"

    agency = props.get("agency", {}) or {}
    agent = props.get("agentDetails", {}) or {}

    return (
        {
            "name": props.get("name") or agent.get("name"),
            "phone": _format_phone(props.get("phone") or agent.get("phone_number")),
            "email": agent.get("email") or agency.get("email"),
            "address": props.get("address"),
            "primary_features": _safe_bool_dict(props.get("primaryFeatures")),
            "utility_features": _safe_bool_dict(props.get("utilityFeatures")),
            "communication_features": _safe_bool_dict(props.get("communicationFeatures")),
            "near_by_features": _safe_bool_dict(props.get("nearByFeatures")),
        },
        None,
    )


async def fetch_zameen_amenities(url: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Fetch a Zameen property page and extract the Amenities section.
    Returns (categories, error_message)
    """
    html = await _fetch_html(url)
    if not html:
        return None, "Failed to fetch Zameen page"

    soup = BeautifulSoup(html, "html.parser")
    amenities_header = soup.find("h3", string=lambda s: s and "Amenities" in s)
    if not amenities_header:
        return None, "Amenities section not found"

    root = amenities_header.find_parent("div", class_="_83bb17d1")
    if not root:
        return None, "Amenities container not found"

    categories: Dict[str, Any] = {}
    for category_li in root.select("li._51519f00"):
        title_el = category_li.find("div", class_="d0142259")
        title = title_el.get_text(strip=True) if title_el else "Other Amenities"
        items = []
        for item in category_li.select("ul._3efd3392 li span._9121cbf9"):
            text = item.get_text(" ", strip=True)
            if text:
                items.append(text)
        if items:
            categories[title] = items

    return (categories or None, None)


async def enrich_property_from_source(source: str, link: Optional[str]) -> Dict[str, Any]:
    """
    Enrich property data by scraping source links when available.
    Only fetches when a link is provided and source is recognized.
    """
    if not link:
        return {}

    source = (source or "").lower()
    result: Dict[str, Any] = {}

    if source == "graana":
        data, _ = await fetch_graana_details(link)
        if data:
            result["scraped_contact"] = {
                "name": data.get("name"),
                "phone": data.get("phone"),
                "email": data.get("email"),
                "address": data.get("address"),
            }
            result["scraped_features"] = {
                "Primary": [k.replace("_", " ").title() for k, v in data.get("primary_features", {}).items() if v],
                "Utilities": [k.replace("_", " ").title() for k, v in data.get("utility_features", {}).items() if v],
                "Communication": [k.replace("_", " ").title() for k, v in data.get("communication_features", {}).items() if v],
                "Nearby": [k.replace("_", " ").title() for k, v in data.get("near_by_features", {}).items() if v],
            }
    elif source == "zameen":
        amenities, _ = await fetch_zameen_amenities(link)
        if amenities:
            result["scraped_amenities"] = amenities

    return result


