/**
 * PPT Export API Types
 * Match backend PPT export schemas
 */

export type PPTExportStatus = "queued" | "processing" | "completed" | "failed";

export interface PPTExportRequest {
  property_id: string;
}

export interface PPTExportResponse {
  id: string;
  user_id: string;
  property_id: string;
  status: PPTExportStatus;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface PPTExportJobResponse {
  job_id: string;
  status: PPTExportStatus;
  message: string;
}

export interface PPTExportListResponse {
  items: PPTExportResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PPTExportActivityResponse {
  id: string;
  property_id: string;
  property_title: string | null;
  property_location: string | null;
  status: PPTExportStatus;
  file_url: string | null;
  created_at: string;
  completed_at: string | null;
}
