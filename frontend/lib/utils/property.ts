/**
 * Property Utility Functions
 * Convert API properties to dashboard format and helper functions
 */

import type { ApiProperty } from "@/types/api/property";
import type { DashboardProperty } from "@/types/dashboard/property";

/**
 * Clean and validate image URL
 */
function cleanImageUrl(url: string): string {
  // Remove @ prefix if present
  let cleanedUrl = url.trim();
  if (cleanedUrl.startsWith("@")) {
    cleanedUrl = cleanedUrl.slice(1);
  }

  // Validate URL format
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
 * Get first image URL from property images
 */
export function getPropertyImage(property: ApiProperty): string {
  if (!property.images || property.images.length === 0) {
    return "/placeholder-property.jpg";
  }

  const firstImage = property.images[0];

  if (typeof firstImage === "string") {
    return cleanImageUrl(firstImage);
  }

  if (typeof firstImage === "object" && firstImage !== null) {
    const url = (firstImage as { url?: string }).url;
    if (url && typeof url === "string") {
      return cleanImageUrl(url);
    }
  }

  return "/placeholder-property.jpg";
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
