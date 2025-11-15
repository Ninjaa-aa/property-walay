/**
 * Property Utility Functions
 * Convert API properties to dashboard format and helper functions
 */

import type { ApiProperty } from "@/types/api/property";
import type { DashboardProperty } from "@/types/dashboard/property";

/**
 * Clean and validate image URL
 * Exported so it can be used in components that need to clean image arrays
 */
export function cleanImageUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return "/placeholder-property.jpg";
  }

  // Remove @ prefix if present (can appear at start or after whitespace)
  let cleanedUrl = url.trim();

  // Remove @ prefix - handle multiple @ symbols
  while (cleanedUrl.startsWith("@")) {
    cleanedUrl = cleanedUrl.slice(1).trim();
  }

  // Validate URL format - must be absolute URL or relative path
  if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
    return cleanedUrl;
  }

  // If it's a relative path, ensure it starts with /
  if (cleanedUrl.startsWith("/")) {
    return cleanedUrl;
  }

  // Invalid URL, return placeholder
  return "/placeholder-property.jpg";
}

/**
 * Get all cleaned image URLs from property images array
 * Handles both string arrays and object arrays, removes @ prefix, validates URLs
 */
export function getCleanedImages(images: ApiProperty["images"]): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }

  const cleanedUrls: string[] = [];

  for (const img of images) {
    let urlToClean: string | null = null;

    // Handle string images
    if (typeof img === "string") {
      urlToClean = img;
    }
    // Handle object images (with url property)
    else if (typeof img === "object" && img !== null) {
      const urlObj = img as { url?: string | unknown };
      if (urlObj.url && typeof urlObj.url === "string") {
        urlToClean = urlObj.url;
      }
    }

    // Clean and validate the URL
    if (urlToClean) {
      const cleaned = cleanImageUrl(urlToClean);
      // Only add valid (non-placeholder) URLs
      if (cleaned !== "/placeholder-property.jpg") {
        cleanedUrls.push(cleaned);
      }
    }
  }

  return cleanedUrls;
}

/**
 * Get first image URL from property images
 */
export function getPropertyImage(property: ApiProperty): string {
  const cleanedImages = getCleanedImages(property.images);
  return cleanedImages.length > 0
    ? cleanedImages[0]
    : "/placeholder-property.jpg";
}

/**
 * Convert API property to dashboard property format
 */
export function apiPropertyToDashboard(
  property: ApiProperty
): DashboardProperty {
  return {
    id: property.our_id,
    title: property.title || "Untitled Property",
    location: property.area_name || "Unknown Location",
    city: property.area_name?.split(",")[0] || "Unknown",
    price: property.current_price || 0,
    currency: (property.currency as "PKR" | "USD") || "PKR",
    propertyType:
      (property.prop_type as "house" | "apartment" | "plot" | "commercial") ||
      "house",
    beds: property.beds ?? undefined,
    baths: property.baths ?? undefined,
    size: property.area_size ? Number(property.area_size) : undefined,
    sizeUnit: (property.area_unit as "marla" | "kanal" | "sqft") || undefined,
    image: getPropertyImage(property),
  };
}

/**
 * Format property type for display
 */
export function formatPropertyType(type: string | null): string {
  if (!type) return "Property";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Format area size with unit
 */
export function formatAreaSize(
  size: number | null,
  unit: string | null
): string {
  if (!size) return "N/A";
  const unitStr = unit ? ` ${unit}` : "";
  return `${size}${unitStr}`;
}
