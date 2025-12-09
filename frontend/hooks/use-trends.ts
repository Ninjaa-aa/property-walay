"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ApiClientError } from "@/lib/api/client";
import {
  getTrendsSummary,
  getRegions,
  getCities,
  getCityTopLocations,
  getTopMovers,
  getAnalyticsOverview,
  getLocationHistory,
  getMapLocations,
  type GetCitiesParams,
} from "@/lib/api/trends";
import type {
  TrendsSummary,
  TrendsRegion,
  TrendsCity,
  TopLocation,
  TopMover,
  AnalyticsOverview,
  LocationHistory,
  MapLocation,
  TrendsCategory,
} from "@/types/api/trends";

// ============================================
// Summary Hook
// ============================================

interface UseTrendsSummaryReturn {
  summary: TrendsSummary | null;
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useTrendsSummary(): UseTrendsSummaryReturn {
  const [summary, setSummary] = useState<TrendsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchSummary = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getTrendsSummary();
      setSummary(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch trends summary"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}

// ============================================
// Regions Hook
// ============================================

interface UseRegionsReturn {
  regions: TrendsRegion[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useRegions(): UseRegionsReturn {
  const [regions, setRegions] = useState<TrendsRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchRegions = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getRegions();
      setRegions(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch regions"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return { regions, loading, error, refetch: fetchRegions };
}

// ============================================
// Cities Hook
// ============================================

interface UseCitiesReturn {
  cities: TrendsCity[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useCities(params?: GetCitiesParams): UseCitiesReturn {
  const [cities, setCities] = useState<TrendsCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);
  const paramsRef = useRef(params);
  const prevParamsStringRef = useRef<string>("");

  const fetchCities = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getCities(paramsRef.current);
      setCities(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch cities"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const currentParamsString = JSON.stringify(params);
    if (currentParamsString !== prevParamsStringRef.current) {
      paramsRef.current = params;
      prevParamsStringRef.current = currentParamsString;
      fetchingRef.current = false;
      fetchCities();
    }
  }, [fetchCities, params]);

  return { cities, loading, error, refetch: fetchCities };
}

// ============================================
// Top Locations Hook
// ============================================

interface UseTopLocationsReturn {
  locations: TopLocation[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useTopLocations(
  cityId: number,
  category: TrendsCategory = "buying",
  limit: number = 10
): UseTopLocationsReturn {
  const [locations, setLocations] = useState<TopLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchLocations = useCallback(async () => {
    if (fetchingRef.current || !cityId) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getCityTopLocations(cityId, category, limit);
      setLocations(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch top locations"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [cityId, category, limit]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}

// ============================================
// Top Movers Hook
// ============================================

interface UseTopMoversReturn {
  movers: TopMover[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useTopMovers(
  category: TrendsCategory = "buying",
  direction: "up" | "down" = "up",
  limit: number = 10
): UseTopMoversReturn {
  const [movers, setMovers] = useState<TopMover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchMovers = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getTopMovers(category, direction, limit);
      setMovers(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch top movers"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [category, direction, limit]);

  useEffect(() => {
    fetchMovers();
  }, [fetchMovers]);

  return { movers, loading, error, refetch: fetchMovers };
}

// ============================================
// Analytics Overview Hook
// ============================================

interface UseAnalyticsOverviewReturn {
  analytics: AnalyticsOverview | null;
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useAnalyticsOverview(
  category: TrendsCategory = "buying"
): UseAnalyticsOverviewReturn {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchAnalytics = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getAnalyticsOverview(category);
      setAnalytics(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch analytics"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [category]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

// ============================================
// Location History Hook
// ============================================

interface UseLocationHistoryReturn {
  history: LocationHistory | null;
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useLocationHistory(
  locationId: number,
  category: TrendsCategory = "buying",
  months: number = 12
): UseLocationHistoryReturn {
  const [history, setHistory] = useState<LocationHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchHistory = useCallback(async () => {
    if (fetchingRef.current || !locationId) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getLocationHistory(locationId, category, months);
      setHistory(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch location history"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [locationId, category, months]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}

// ============================================
// Map Locations Hook
// ============================================

interface UseMapLocationsReturn {
  locations: MapLocation[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

export function useMapLocations(params?: {
  region_id?: number;
  city_id?: number;
  category?: TrendsCategory;
}): UseMapLocationsReturn {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);
  const paramsRef = useRef(params);
  const prevParamsStringRef = useRef<string>("");

  const fetchLocations = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getMapLocations(paramsRef.current);
      setLocations(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(new ApiClientError(500, "Failed to fetch map locations"));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const currentParamsString = JSON.stringify(params);
    if (currentParamsString !== prevParamsStringRef.current) {
      paramsRef.current = params;
      prevParamsStringRef.current = currentParamsString;
      fetchingRef.current = false;
      fetchLocations();
    }
  }, [fetchLocations, params]);

  return { locations, loading, error, refetch: fetchLocations };
}
