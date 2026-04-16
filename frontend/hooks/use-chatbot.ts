"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  ChatSession,
  ChatMessage,
  ChatResponseItem,
  WebhookFilters,
  WebhookProperty,
} from "@/types/chatbot";
import { sendChatQuery, loadMoreProperties } from "@/lib/api/chatbot";

const STORAGE_KEY = "chatbot_sessions";

function generateId(): string {
  return crypto.randomUUID();
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function titleFromQuery(query: string): string {
  return query.length > 40 ? query.slice(0, 40) + "..." : query;
}

export function useChatbot() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = loadSessions();
    setSessions(stored);
    if (stored.length > 0) {
      setActiveSessionId(stored[0].id);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
      persistSessions(sessions);
    }
  }, [sessions]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ?? null;

  const createNewSession = useCallback((): string => {
    const session: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    return session.id;
  }, []);

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setSessions((prev) => {
          const remaining = prev.filter((s) => s.id !== sessionId);
          setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
          return remaining;
        });
      }
    },
    [activeSessionId]
  );

  const sendMessage = useCallback(
    async (query: string) => {
      let sessionId = activeSessionId;

      if (!sessionId) {
        const newSession: ChatSession = {
          id: generateId(),
          title: titleFromQuery(query),
          messages: [],
          createdAt: new Date().toISOString(),
        };
        sessionId = newSession.id;
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(sessionId);
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      const targetId = sessionId;

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== targetId) return s;
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? titleFromQuery(query) : s.title,
            messages: [...s.messages, userMsg],
          };
        })
      );

      setLoading(true);

      try {
        const results: ChatResponseItem[] = await sendChatQuery(query);

        const assistantMessages: ChatMessage[] = results.map((item) => {
          if (item.type === "properties") {
            return {
              id: generateId(),
              role: "assistant" as const,
              content: `Found ${item.properties?.length ?? 0} properties`,
              properties: item.properties,
              filters: item.filters,
              timestamp: new Date().toISOString(),
            };
          }
          return {
            id: generateId(),
            role: "assistant" as const,
            content: item.text ?? "",
            timestamp: new Date().toISOString(),
          };
        });

        const lastPropertyMsg = assistantMessages.find(
          (m) => m.properties && m.filters
        );

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== targetId) return s;
            return {
              ...s,
              messages: [...s.messages, ...assistantMessages],
              lastFilters: lastPropertyMsg?.filters ?? s.lastFilters,
              lastPage: lastPropertyMsg ? 1 : s.lastPage,
            };
          })
        );
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            err instanceof Error
              ? `Error: ${err.message}`
              : "Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setSessions((prev) =>
          prev.map((s) =>
            s.id === targetId
              ? { ...s, messages: [...s.messages, errorMsg] }
              : s
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [activeSessionId]
  );

  const loadMore = useCallback(async () => {
    if (!activeSession?.lastFilters) return;

    const nextPage = (activeSession.lastPage ?? 1) + 1;
    setLoadingMore(true);

    try {
      const result = await loadMoreProperties({
        filters: activeSession.lastFilters,
        page: nextPage,
      });

      if (!result.items || result.items.length === 0) return;

      const moreMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Showing page ${nextPage} — ${result.items.length} more properties`,
        properties: result.items as unknown as WebhookProperty[],
        filters: activeSession.lastFilters,
        timestamp: new Date().toISOString(),
      };

      const targetId = activeSession.id;
      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                messages: [...s.messages, moreMsg],
                lastPage: nextPage,
              }
            : s
        )
      );
    } catch {
      // silently fail load-more
    } finally {
      setLoadingMore(false);
    }
  }, [activeSession]);

  return {
    sessions,
    activeSession,
    activeSessionId,
    loading,
    loadingMore,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    sendMessage,
    loadMore,
  };
}
