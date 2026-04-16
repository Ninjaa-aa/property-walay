import { apiGet, apiPost, ApiClientError } from "./client";
import type { ChatResponseItem, WebhookFilters } from "@/types/chatbot";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface TranscriptionResult {
  text: string;
  language?: string | null;
  duration?: number | null;
}

export async function sendChatQuery(
  query: string
): Promise<ChatResponseItem[]> {
  return apiPost<ChatResponseItem[]>("/chatbot/query", { query });
}

export interface LoadMoreParams {
  filters: WebhookFilters;
  page?: number;
  pageSize?: number;
}

interface PropertyListResponse {
  items: ChatResponseItem["properties"];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function loadMoreProperties({
  filters,
  page = 1,
  pageSize = 5,
}: LoadMoreParams): Promise<PropertyListResponse> {
  const params: Record<string, string | number | boolean | undefined> = {
    page,
    page_size: pageSize,
  };

  if (filters.area_name) params.area_name = filters.area_name;
  if (filters.beds != null) params.beds = filters.beds;
  if (filters.baths != null) params.baths = filters.baths;
  if (filters.min_price != null) params.min_price = filters.min_price;
  if (filters.max_price != null) params.max_price = filters.max_price;
  if (filters.min_area != null) params.min_area_size = filters.min_area;
  if (filters.max_area != null) params.max_area_size = filters.max_area;
  if (filters.prop_type) params.prop_type = filters.prop_type;
  if (filters.listing_type) params.listing_type = filters.listing_type;

  return apiGet<PropertyListResponse>("/properties", params);
}

export async function transcribeAudio(
  blob: Blob,
  filename = "recording.webm"
): Promise<TranscriptionResult> {
  const form = new FormData();
  form.append("file", blob, filename);

  const response = await fetch(`${API_BASE_URL}/chatbot/transcribe`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // not JSON
    }
    throw new ApiClientError(response.status, detail);
  }

  return response.json();
}
