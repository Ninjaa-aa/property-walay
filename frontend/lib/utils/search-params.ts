/**
 * Utilities for handling search page URL parameters
 */

import type { PropertyListParams } from "@/types/api/property";
import { ReadonlyURLSearchParams } from "next/navigation";

type SearchParamsLike = URLSearchParams | ReadonlyURLSearchParams;

/**
 * Parse URL search params into PropertyListParams
 */
export function parseSearchParams(
  searchParams: SearchParamsLike
): PropertyListParams {
  const params: PropertyListParams = {
    page: parseInt(searchParams.get("page") || "1"),
    page_size: parseInt(searchParams.get("page_size") || "20"),
  };

  const area_name = searchParams.get("area_name");
  if (area_name) params.area_name = area_name;

  const prop_type = searchParams.get("prop_type");
  if (prop_type) params.prop_type = prop_type;

  const listing_type = searchParams.get("listing_type");
  if (listing_type) params.listing_type = listing_type as "rent" | "sale";

  const source = searchParams.get("source");
  if (source) params.source = source as "graana" | "lamudi" | "zameen";

  const beds = searchParams.get("beds");
  if (beds) params.beds = parseInt(beds);

  const baths = searchParams.get("baths");
  if (baths) params.baths = parseInt(baths);

  const min_price = searchParams.get("min_price");
  if (min_price) params.min_price = parseFloat(min_price);

  const max_price = searchParams.get("max_price");
  if (max_price) params.max_price = parseFloat(max_price);

  return params;
}

/**
 * Convert PropertyListParams to URL search params string
 */
export function filtersToSearchParams(filters: PropertyListParams): string {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }
  if (filters.page_size && filters.page_size !== 20) {
    params.set("page_size", filters.page_size.toString());
  }
  if (filters.area_name) {
    params.set("area_name", filters.area_name);
  }
  if (filters.prop_type) {
    params.set("prop_type", filters.prop_type);
  }
  if (filters.listing_type) {
    params.set("listing_type", filters.listing_type);
  }
  if (filters.source) {
    params.set("source", filters.source);
  }
  if (filters.beds) {
    params.set("beds", filters.beds.toString());
  }
  if (filters.baths) {
    params.set("baths", filters.baths.toString());
  }
  if (filters.min_price) {
    params.set("min_price", filters.min_price.toString());
  }
  if (filters.max_price) {
    params.set("max_price", filters.max_price.toString());
  }

  return params.toString();
}

/**
 * Get URL path from filters
 */
export function getSearchUrl(filters: PropertyListParams): string {
  const params = filtersToSearchParams(filters);
  return params ? `/dashboard/search?${params}` : "/dashboard/search";
}
