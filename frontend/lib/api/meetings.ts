import { apiPost } from "./client";
import type { MeetingWebhookResponse } from "@/types/meeting";

export async function scheduleMeeting(
  userId: string,
  propertyId: string
): Promise<MeetingWebhookResponse> {
  return apiPost<MeetingWebhookResponse>("/meetings/schedule", {
    user_id: userId,
    property_id: propertyId,
  });
}
