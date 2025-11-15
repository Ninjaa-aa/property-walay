/**
 * Utilities for generating property descriptions
 */

import { formatArea } from "./format-area";
import type { ApiProperty } from "@/types/api/property";

/**
 * Generate a description for a property based on its attributes
 */
export function generatePropertyDescription(property: ApiProperty): string {
  if (!property.title) {
    return "Property details available upon request.";
  }

  const parts: string[] = [];

  // Start with property type and location
  parts.push(
    `This ${property.prop_type || "property"} is located in ${
      property.area_name || "a prime location"
    }`
  );

  // Add area if available
  if (property.area_size && property.area_unit) {
    parts.push(`with ${formatArea(property.area_size, property.area_unit)}`);
  }

  // Add bedrooms if available
  if (property.beds) {
    parts.push(
      `featuring ${property.beds} bedroom${property.beds > 1 ? "s" : ""}`
    );
  }

  // Add bathrooms if available
  if (property.baths) {
    parts.push(
      `and ${property.baths} bathroom${property.baths > 1 ? "s" : ""}`
    );
  }

  // Add source
  const sourceName =
    property.source.charAt(0).toUpperCase() + property.source.slice(1);
  parts.push(
    `. This property is listed on ${sourceName} and is available for viewing.`
  );

  return parts.join(" ");
}
