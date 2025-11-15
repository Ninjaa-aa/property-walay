/**
 * API Property Types
 * Match backend PropertyResponse schema
 */

export interface ApiProperty {
  our_id: string;
  source: "graana" | "lamudi" | "zameen";
  source_id: string;
  source_human_id: string | null;
  title: string | null;
  prop_type: string | null;
  prop_subtype: string | null;
  area_size: number | null;
  area_unit: string | null;
  beds: number | null;
  baths: number | null;
  area_name: string | null;
  link: string | null;
  images: string[] | Array<Record<string, unknown>> | null;
  poc_name: string | null;
  poc_number: string | null;
  latitude: number | null;
  longitude: number | null;
  current_price: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
  last_price_change_at: string | null;
}

export interface PropertyListParams {
  source?: "graana" | "lamudi" | "zameen";
  prop_type?: string;
  prop_subtype?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  beds?: number;
  baths?: number;
  area_name?: string;
  min_area_size?: number;
  max_area_size?: number;
  page?: number;
  page_size?: number;
}

export interface PropertyListResponse {
  items: ApiProperty[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

