"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatFloatingButton() {
  const pathname = usePathname();

  if (pathname === "/dashboard/chatbot") return null;

  return (
    <Link href="/dashboard/chatbot">
      <Button
        size="icon"
        className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </Link>
  );
}
