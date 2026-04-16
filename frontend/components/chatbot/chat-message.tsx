"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chatbot";
import { ChatPropertyCard } from "./chat-property-card";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] space-y-3",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted rounded-bl-sm"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.properties && message.properties.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {message.properties.map((prop, idx) => (
              <ChatPropertyCard
                key={prop.our_id ?? idx}
                property={prop}
              />
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-[10px]">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <User className="text-primary-foreground h-4 w-4" />
        </div>
      )}
    </div>
  );
}
