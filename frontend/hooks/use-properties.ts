"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getProperties, getRecommendedProperties } from "@/lib/api/properties";
import { ApiClientError } from "@/lib/api/client";
import type { ApiProperty, PropertyListParams } from "@/types/api/property";

interface UsePropertiesReturn {
  properties: ApiProperty[];
  loading: boolean;
  error: ApiClientError | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage properties list
 */
export function useProperties(
  params?: PropertyListParams
): UsePropertiesReturn {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [pageSize, setPageSize] = useState(params?.page_size || 20);
  const [totalPages, setTotalPages] = useState(0);
  const fetchingRef = useRef(false);
  const paramsRef = useRef(params);

  const fetchProperties = useCallback(async () => {
    // Prevent duplicate requests
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await getProperties(paramsRef.current);
      setProperties(response.items);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.page_size);
      setTotalPages(response.total_pages);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(
          new ApiClientError(500, "An unexpected error occurred", String(err))
        );
      }
      setProperties([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Refetch when params change
  useEffect(() => {
    paramsRef.current = params;
    if (!fetchingRef.current) {
      fetchProperties();
    }
  }, [fetchProperties, params]);

  return {
    properties,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    refetch: fetchProperties,
  };
}

interface UseRecommendedPropertiesReturn {
  properties: ApiProperty[];
  loading: boolean;
  error: ApiClientError | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch recommended properties
 */
export function useRecommendedProperties(
  limit: number = 10
): UseRecommendedPropertiesReturn {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const fetchingRef = useRef(false);

  const fetchRecommended = useCallback(async () => {
    // Prevent duplicate requests
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getRecommendedProperties(limit);
      setProperties(data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err);
      } else {
        setError(
          new ApiClientError(500, "An unexpected error occurred", String(err))
        );
      }
      setProperties([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [limit]);

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

  return {
    properties,
    loading,
    error,
    refetch: fetchRecommended,
  };
}
