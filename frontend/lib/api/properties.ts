/**
 * Property API Service
 * Handles all property-related API calls
 */

import { apiGet, apiPost, apiPut, apiDelete, ApiClientError } from "./client";
import type {
  ApiProperty,
  PropertyListParams,
  PropertyListResponse,
} from "@/types/api/property";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
 * Get content-based recommended properties.
 * When `viewedIds` is non-empty the backend uses the trained embedding
 * model to score against the user's recently viewed properties.
 */
export async function getRecommendedProperties(
  limit: number = 10,
  viewedIds: string[] = []
): Promise<ApiProperty[]> {
  const url = new URL(`${API_BASE_URL}/properties/search/recommended`);
  url.searchParams.set("limit", String(limit));
  viewedIds.forEach((id) => url.searchParams.append("viewed_ids", id));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // body not JSON
    }
    throw new ApiClientError(res.status, detail);
  }

  return res.json();
}

/**
 * Get properties similar to a given property using the trained
 * embedding model (cosine similarity over pgvector embeddings).
 */
export async function getSimilarProperties(
  propertyId: string,
  limit: number = 10
): Promise<ApiProperty[]> {
  return apiGet<ApiProperty[]>(
    `/properties/${propertyId}/similar`,
    { limit }
  );
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
