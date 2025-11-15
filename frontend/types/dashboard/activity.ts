export type ActivityType =
  | "save"
  | "price_change"
  | "new_matches"
  | "meeting"
  | "view";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  propertyId?: string;
}
