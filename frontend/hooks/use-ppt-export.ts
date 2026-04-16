/**
 * usePptExport Hook
 * Manages PPT generation state and polling
 */

import { useState, useCallback } from "react";
import {
  generatePpt,
  getPptExport,
  getPptDownloadUrl,
  pollPptExportStatus,
} from "@/lib/api/ppt-exports";
import type {
  PPTExportStatus,
  PPTExportResponse,
  PPTExportJobResponse,
} from "@/types/api/ppt-export";

interface UsePptExportState {
  isGenerating: boolean;
  status: PPTExportStatus | null;
  exportData: PPTExportResponse | null;
  error: string | null;
  progress: number; // 0-100
}

interface UsePptExportReturn extends UsePptExportState {
  generatePropertyPpt: (propertyId: string, userId: string) => Promise<void>;
  downloadPpt: () => void;
  reset: () => void;
}

const initialState: UsePptExportState = {
  isGenerating: false,
  status: null,
  exportData: null,
  error: null,
  progress: 0,
};

/**
 * Hook for managing PPT export generation and download
 */
export function usePptExport(): UsePptExportReturn {
  const [state, setState] = useState<UsePptExportState>(initialState);

  const generatePropertyPpt = useCallback(
    async (propertyId: string, userId: string) => {
      setState({
        isGenerating: true,
        status: "queued",
        exportData: null,
        error: null,
        progress: 10,
      });

      try {
        // Start generation
        const jobResponse: PPTExportJobResponse = await generatePpt(
          propertyId,
          userId
        );

        setState((prev) => ({
          ...prev,
          status: jobResponse.status,
          progress: 20,
        }));

        // Poll for completion
        const result = await pollPptExportStatus(jobResponse.job_id, {
          interval: 2000,
          maxAttempts: 30,
          onStatusChange: (statusUpdate) => {
            let progress = 20;
            if (statusUpdate.status === "processing") {
              progress = 50;
            } else if (statusUpdate.status === "completed") {
              progress = 100;
            }

            setState((prev) => ({
              ...prev,
              status: statusUpdate.status,
              progress,
            }));
          },
        });

        setState({
          isGenerating: false,
          status: "completed",
          exportData: result,
          error: null,
          progress: 100,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate PPT";

        setState({
          isGenerating: false,
          status: "failed",
          exportData: null,
          error: errorMessage,
          progress: 0,
        });
      }
    },
    []
  );

  const downloadPpt = useCallback(() => {
    if (state.exportData?.id) {
      const downloadUrl = getPptDownloadUrl(state.exportData.id);
      window.open(downloadUrl, "_blank");
    }
  }, [state.exportData?.id]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    generatePropertyPpt,
    downloadPpt,
    reset,
  };
}

/**
 * Hook for fetching recent PPT export activity
 */
export function useRecentPptActivity(userId: string | null, limit: number = 5) {
  const [activities, setActivities] = useState<PPTExportResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { getRecentPptActivity } = await import("@/lib/api/ppt-exports");
      const data = await getRecentPptActivity(userId, limit);
      setActivities(data as unknown as PPTExportResponse[]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch PPT activities";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
}







