/**
 * Trends API Client
 * Functions for fetching property trends data
 */

import { apiGet } from "./client";
import type {
  TrendsRegion,
  TrendsCity,
  TrendsLocation,
  TrendsLocationWithStats,
  TrendsSummary,
  TopLocation,
  TopMover,
  LocationHistory,
  AnalyticsOverview,
  LocationComparison,
  MapLocation,
  MapCity,
  TrendsCategory,
} from "@/types/api/trends";

// ============================================
// Summary
// ============================================

export async function getTrendsSummary(): Promise<TrendsSummary> {
  return apiGet<TrendsSummary>("/trends/summary");
}

// ============================================
// Regions
// ============================================

export async function getRegions(): Promise<TrendsRegion[]> {
  return apiGet<TrendsRegion[]>("/trends/regions");
}

export async function getRegion(regionId: number): Promise<TrendsRegion> {
  return apiGet<TrendsRegion>(`/trends/regions/${regionId}`);
}

export async function getRegionCities(regionId: number): Promise<TrendsCity[]> {
  return apiGet<TrendsCity[]>(`/trends/regions/${regionId}/cities`);
}

// ============================================
// Cities
// ============================================

export interface GetCitiesParams {
  region_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getCities(
  params?: GetCitiesParams
): Promise<TrendsCity[]> {
  return apiGet<TrendsCity[]>(
    "/trends/cities",
    params as Record<string, string | number | boolean | undefined>
  );
}

export async function getCity(cityId: number): Promise<TrendsCity> {
  return apiGet<TrendsCity>(`/trends/cities/${cityId}`);
}

export async function getCityLocations(
  cityId: number
): Promise<TrendsLocation[]> {
  return apiGet<TrendsLocation[]>(`/trends/cities/${cityId}/locations`);
}

export async function getCityTopLocations(
  cityId: number,
  category: TrendsCategory = "buying",
  limit: number = 10
): Promise<TopLocation[]> {
  return apiGet<TopLocation[]>(`/trends/cities/${cityId}/top-locations`, {
    category,
    limit,
  });
}

// ============================================
// Locations
// ============================================

export interface GetLocationsParams {
  city_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getLocations(
  params?: GetLocationsParams
): Promise<TrendsLocation[]> {
  return apiGet<TrendsLocation[]>(
    "/trends/locations",
    params as Record<string, string | number | boolean | undefined>
  );
}

export async function getLocation(
  locationId: number
): Promise<TrendsLocationWithStats> {
  return apiGet<TrendsLocationWithStats>(`/trends/locations/${locationId}`);
}

export async function getLocationHistory(
  locationId: number,
  category: TrendsCategory = "buying",
  months: number = 12
): Promise<LocationHistory> {
  return apiGet<LocationHistory>(`/trends/locations/${locationId}/history`, {
    category,
    months,
  });
}

// ============================================
// Rankings
// ============================================

export async function getTopMovers(
  category: TrendsCategory = "buying",
  direction: "up" | "down" = "up",
  limit: number = 10
): Promise<TopMover[]> {
  return apiGet<TopMover[]>("/trends/rankings/top-movers", {
    category,
    direction,
    limit,
  });
}

export async function getCityRankings(
  cityId: number,
  category: TrendsCategory = "buying",
  statsDate?: string,
  limit: number = 20
): Promise<TopLocation[]> {
  return apiGet<TopLocation[]>(`/trends/rankings/city/${cityId}`, {
    category,
    stats_date: statsDate,
    limit,
  });
}

// ============================================
// Analytics
// ============================================

export async function getAnalyticsOverview(
  category: TrendsCategory = "buying"
): Promise<AnalyticsOverview> {
  return apiGet<AnalyticsOverview>("/trends/analytics/overview", { category });
}

export async function getLocationComparison(
  locationIds: number[],
  category: TrendsCategory = "buying"
): Promise<LocationComparison[]> {
  return apiGet<LocationComparison[]>("/trends/analytics/comparison", {
    location_ids: locationIds.join(","),
    category,
  });
}

// ============================================
// Map Data
// ============================================

export async function getMapLocations(params?: {
  region_id?: number;
  city_id?: number;
  category?: TrendsCategory;
}): Promise<MapLocation[]> {
  return apiGet<MapLocation[]>("/trends/map/locations", params);
}

export async function getMapCities(regionId?: number): Promise<MapCity[]> {
  return apiGet<MapCity[]>("/trends/map/cities", { region_id: regionId });
}
