export interface MeetingWebhookResponse {
  status: string;
  message: string | null;
  raw: unknown;
}

export interface Meeting {
  id: string;
  user_id: string;
  property_id: string;
  status: string;
  message: string | null;
  webhook_response: unknown;
  created_at: string;
}

export interface MeetingWithProperty extends Meeting {
  property?: {
    our_id: string;
    title: string | null;
    area_name: string | null;
    current_price: number | null;
    currency: string | null;
    images: unknown;
  } | null;
}
