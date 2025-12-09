export type ActivityType =
  | "save"
  | "price_change"
  | "new_matches"
  | "meeting"
  | "view"
  | "ppt_export";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  propertyId?: string;
  /** For ppt_export type - URL to download the generated PPT */
  downloadUrl?: string;
}
