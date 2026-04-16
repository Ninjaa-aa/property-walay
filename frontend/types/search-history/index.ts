import type { PropertyListParams } from "@/types/api/property";

export interface ViewedProperty {
  propertyId: string;
  title: string;
  areaName: string | null;
  price: number | null;
  viewedAt: string;
}

export interface SearchHistoryEntry {
  id: string;
  title: string;
  filters: PropertyListParams;
  createdAt: string;
}

export interface SearchHistorySession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  entries: SearchHistoryEntry[];
  viewedProperties: ViewedProperty[];
}
