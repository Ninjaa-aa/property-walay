"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getProperties, getRecommendedProperties } from "@/lib/api/properties";
import { ApiClientError } from "@/lib/api/client";
import { useSearchHistoryStore } from "@/lib/stores/search-history-store";
import type { ApiProperty, PropertyListParams } from "@/types/api/property";

const MAX_VIEWED_SIGNALS = 10;

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
  const prevParamsStringRef = useRef<string>("");

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
    const currentParamsString = JSON.stringify(params);

    // Only fetch if params actually changed
    if (currentParamsString !== prevParamsStringRef.current) {
      paramsRef.current = params;
      prevParamsStringRef.current = currentParamsString;
      fetchingRef.current = false;
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

  const sessions = useSearchHistoryStore((s) => s.sessions);
  const activeSessionId = useSearchHistoryStore((s) => s.activeSessionId);

  // Collect the most recently viewed property IDs across the active session
  // first, then any other session, de-duplicated, capped to MAX_VIEWED_SIGNALS.
  const viewedIds = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    const pushFrom = (sessionId: string | null | undefined) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;
      for (const v of session.viewedProperties) {
        if (!seen.has(v.propertyId)) {
          seen.add(v.propertyId);
          ordered.push(v.propertyId);
          if (ordered.length >= MAX_VIEWED_SIGNALS) return;
        }
      }
    };
    pushFrom(activeSessionId);
    for (const s of sessions) {
      if (ordered.length >= MAX_VIEWED_SIGNALS) break;
      if (s.id !== activeSessionId) pushFrom(s.id);
    }
    return ordered;
  }, [sessions, activeSessionId]);

  const viewedKey = viewedIds.join(",");

  const fetchRecommended = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendedProperties(limit, viewedIds);
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
    // `viewedIds` is derived; `viewedKey` drives re-fetch when the list actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, viewedKey]);

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
