export interface WebhookFilters {
  city?: string;
  area_name?: string;
  beds?: number | null;
  baths?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  min_area?: number | null;
  max_area?: number | null;
  area_unit?: string;
  listing_type?: string;
  prop_type?: string;
}

export interface WebhookProperty {
  our_id?: string;
  source?: string;
  source_id?: string;
  source_human_id?: string;
  title?: string;
  prop_type?: string;
  prop_subtype?: string;
  area_size?: number;
  area_unit?: string;
  beds?: number;
  baths?: number;
  area_name?: string;
  link?: string;
  images?: string[];
  poc_name?: string;
  poc_number?: string;
  latitude?: number;
  longitude?: number;
  current_price?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  last_price_change_at?: string;
  listing_type?: string;
}

export interface ChatResponseItem {
  type: "properties" | "text";
  text?: string;
  filters?: WebhookFilters;
  properties?: WebhookProperty[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: WebhookProperty[];
  filters?: WebhookFilters;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  lastFilters?: WebhookFilters;
  lastPage?: number;
}
