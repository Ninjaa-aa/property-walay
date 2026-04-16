import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PropertyListParams } from "@/types/api/property";
import type {
  SearchHistoryEntry,
  SearchHistorySession,
  ViewedProperty,
} from "@/types/search-history";

const MAX_SESSIONS = 50;
const MAX_ENTRIES_PER_SESSION = 25;
const MAX_VIEWS_PER_SESSION = 50;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateId(): string {
  return crypto.randomUUID();
}

function summarizeFilters(filters: PropertyListParams): string {
  const parts: string[] = [];
  if (filters.area_name) parts.push(filters.area_name);
  if (filters.prop_type) parts.push(filters.prop_type);
  if (filters.listing_type) parts.push(filters.listing_type);
  if (filters.beds) parts.push(`${filters.beds} bed`);
  if (filters.baths) parts.push(`${filters.baths} bath`);
  if (filters.source) parts.push(filters.source);
  if (filters.min_price || filters.max_price) parts.push("price filter");
  return parts.length > 0 ? parts.join(" | ") : "General search";
}

function stripPagination(filters: PropertyListParams): PropertyListParams {
  const { page, page_size, ...rest } = filters;
  return rest;
}

function filtersEqual(a: PropertyListParams, b: PropertyListParams): boolean {
  return JSON.stringify(stripPagination(a)) === JSON.stringify(stripPagination(b));
}

function isSessionExpired(session: SearchHistorySession): boolean {
  const updatedAt = new Date(session.updatedAt).getTime();
  return Date.now() - updatedAt > SESSION_TIMEOUT_MS;
}

interface SearchHistoryState {
  sessions: SearchHistorySession[];
  activeSessionId: string | null;

  recordSearch: (filters: PropertyListParams) => void;
  recordPropertyView: (property: ViewedProperty) => void;
  createSession: (title?: string) => string;
  deleteSession: (sessionId: string) => void;
  setActiveSessionId: (sessionId: string) => void;
  clearAll: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (title?: string) => {
        const id = generateId();
        const now = new Date().toISOString();
        const session: SearchHistorySession = {
          id,
          title: title || "New search session",
          createdAt: now,
          updatedAt: now,
          entries: [],
          viewedProperties: [],
        };
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, MAX_SESSIONS),
          activeSessionId: id,
        }));
        return id;
      },

      recordSearch: (filters: PropertyListParams) => {
        const state = get();
        const now = new Date().toISOString();
        const stripped = stripPagination(filters);
        const hasRealFilters = Object.keys(stripped).length > 0;
        const title = summarizeFilters(filters);

        let targetId = state.activeSessionId;
        const activeSession = targetId
          ? state.sessions.find((s) => s.id === targetId)
          : null;

        if (!activeSession || isSessionExpired(activeSession)) {
          targetId = get().createSession(title);
        }

        set((prev) => ({
          activeSessionId: targetId,
          sessions: prev.sessions.map((session) => {
            if (session.id !== targetId) return session;

            const latestEntry = session.entries[0];
            if (latestEntry && filtersEqual(latestEntry.filters, filters)) {
              return { ...session, updatedAt: now };
            }

            if (!hasRealFilters) {
              return { ...session, updatedAt: now };
            }

            const entry: SearchHistoryEntry = {
              id: generateId(),
              title,
              filters: stripped,
              createdAt: now,
            };

            return {
              ...session,
              title,
              updatedAt: now,
              entries: [entry, ...session.entries].slice(0, MAX_ENTRIES_PER_SESSION),
            };
          }),
        }));
      },

      recordPropertyView: (property: ViewedProperty) => {
        const state = get();
        let targetId = state.activeSessionId;
        const activeSession = targetId
          ? state.sessions.find((s) => s.id === targetId)
          : null;

        if (!activeSession) {
          targetId = get().createSession("Property browsing");
        }

        set((prev) => ({
          activeSessionId: targetId,
          sessions: prev.sessions.map((session) => {
            if (session.id !== targetId) return session;

            const alreadyViewed = session.viewedProperties.some(
              (v) => v.propertyId === property.propertyId
            );
            if (alreadyViewed) {
              return {
                ...session,
                updatedAt: new Date().toISOString(),
                viewedProperties: session.viewedProperties.map((v) =>
                  v.propertyId === property.propertyId
                    ? { ...v, viewedAt: property.viewedAt }
                    : v
                ),
              };
            }

            return {
              ...session,
              updatedAt: new Date().toISOString(),
              viewedProperties: [property, ...session.viewedProperties].slice(
                0,
                MAX_VIEWS_PER_SESSION
              ),
            };
          }),
        }));
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const next = state.sessions.filter((s) => s.id !== sessionId);
          return {
            sessions: next,
            activeSessionId:
              state.activeSessionId === sessionId
                ? next[0]?.id ?? null
                : state.activeSessionId,
          };
        });
      },

      setActiveSessionId: (sessionId: string) => {
        set({ activeSessionId: sessionId });
      },

      clearAll: () => {
        set({ sessions: [], activeSessionId: null });
      },
    }),
    {
      name: "property-search-history",
    }
  )
);
