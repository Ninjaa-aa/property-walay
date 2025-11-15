/**
 * Property API Service
 * Handles all property-related API calls
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type {
  ApiProperty,
  PropertyListParams,
  PropertyListResponse,
} from "@/types/api/property";

/**
 * Default page size from environment variable
 */
const DEFAULT_PAGE_SIZE = parseInt(
  process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || "20",
  10
);

/**
 * Get list of properties with optional filters
 */
export async function getProperties(
  params?: PropertyListParams
): Promise<PropertyListResponse> {
  const page = params?.page ?? 1;
  const page_size = params?.page_size ?? DEFAULT_PAGE_SIZE;

  return apiGet<PropertyListResponse>("/properties", {
    ...params,
    page,
    page_size,
  });
}

/**
 * Get single property by ID
 */
export async function getProperty(propertyId: string): Promise<ApiProperty> {
  return apiGet<ApiProperty>(`/properties/${propertyId}`);
}

/**
 * Get recommended properties
 */
export async function getRecommendedProperties(
  limit: number = 10
): Promise<ApiProperty[]> {
  return apiGet<ApiProperty[]>("/properties/search/recommended", { limit });
}

/**
 * Create a new property
 */
export async function createProperty(
  data: Partial<ApiProperty>
): Promise<ApiProperty> {
  return apiPost<ApiProperty>("/properties", data);
}

/**
 * Update a property
 */
export async function updateProperty(
  propertyId: string,
  data: Partial<ApiProperty>
): Promise<ApiProperty> {
  return apiPut<ApiProperty>(`/properties/${propertyId}`, data);
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string): Promise<void> {
  return apiDelete<void>(`/properties/${propertyId}`);
}
