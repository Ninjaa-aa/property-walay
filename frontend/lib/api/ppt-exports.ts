/**
 * PPT Export API Service
 * Handles all PPT export-related API calls
 */

import { apiGet, apiPost, apiDelete } from "./client";
import type {
  PPTExportRequest,
  PPTExportResponse,
  PPTExportJobResponse,
  PPTExportListResponse,
  PPTExportActivityResponse,
} from "@/types/api/ppt-export";

/**
 * Generate a PPT presentation for a property
 * Returns immediately with a job ID; PPT is generated in background
 */
export async function generatePpt(
  propertyId: string,
  userId: string
): Promise<PPTExportJobResponse> {
  const request: PPTExportRequest = { property_id: propertyId };
  return apiPost<PPTExportJobResponse>(
    `/ppt-exports?user_id=${userId}`,
    request
  );
}

/**
 * Get PPT export status and details
 */
export async function getPptExport(exportId: string): Promise<PPTExportResponse> {
  return apiGet<PPTExportResponse>(`/ppt-exports/${exportId}`);
}

/**
 * Get download URL for a completed PPT export
 */
export function getPptDownloadUrl(exportId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  return `${baseUrl}/ppt-exports/${exportId}/download`;
}

/**
 * List PPT exports for a user with pagination
 */
export async function listPptExports(
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PPTExportListResponse> {
  return apiGet<PPTExportListResponse>("/ppt-exports", {
    user_id: userId,
    page,
    page_size: pageSize,
  });
}

/**
 * Get recent PPT export activity for dashboard
 */
export async function getRecentPptActivity(
  userId: string,
  limit: number = 5
): Promise<PPTExportActivityResponse[]> {
  return apiGet<PPTExportActivityResponse[]>("/ppt-exports/user/recent-activity", {
    user_id: userId,
    limit,
  });
}

/**
 * Delete a PPT export record
 */
export async function deletePptExport(exportId: string): Promise<void> {
  return apiDelete<void>(`/ppt-exports/${exportId}`);
}

/**
 * Poll PPT export status until completion or failure
 */
export async function pollPptExportStatus(
  exportId: string,
  options: {
    interval?: number;
    maxAttempts?: number;
    onStatusChange?: (status: PPTExportResponse) => void;
  } = {}
): Promise<PPTExportResponse> {
  const { interval = 2000, maxAttempts = 30, onStatusChange } = options;
  
  let attempts = 0;
  
  return new Promise((resolve, reject) => {
    const poll = async () => {
      attempts++;
      
      try {
        const status = await getPptExport(exportId);
        
        if (onStatusChange) {
          onStatusChange(status);
        }
        
        if (status.status === "completed") {
          resolve(status);
          return;
        }
        
        if (status.status === "failed") {
          reject(new Error(status.error_message || "PPT generation failed"));
          return;
        }
        
        if (attempts >= maxAttempts) {
          reject(new Error("PPT generation timed out"));
          return;
        }
        
        // Continue polling
        setTimeout(poll, interval);
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
}






