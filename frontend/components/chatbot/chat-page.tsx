"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/hooks/use-chatbot";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

export function ChatPage() {
  const {
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
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const hasMoreProperties = !!activeSession?.lastFilters;

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden rounded-xl border">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={setActiveSessionId}
          onNew={createNewSession}
          onDelete={deleteSession}
        />
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
          <Bot className="text-primary h-5 w-5" />
          <h1 className="text-sm font-semibold">
            {activeSession?.title ?? "PropertyWalay AI"}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <Bot className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-lg font-semibold">PropertyWalay AI</h2>
              <p className="text-muted-foreground max-w-sm text-center text-sm">
                Ask me anything about properties in Pakistan. Search by area,
                price, size, or ask about market trends!
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  "10 marla house in Bahria Town",
                  "Average rent in Islamabad",
                  "5 marla plot in DHA Lahore",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="bg-muted hover:bg-muted/80 rounded-full px-4 py-2 text-xs transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSession.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Thinking...
                  </span>
                </div>
              )}

              {hasMoreProperties && !loading && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="gap-2"
                  >
                    {loadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Load more properties
                  </Button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t">
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
