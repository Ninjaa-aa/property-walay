"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Don't show header on dashboard routes
  if (isDashboard) {
    return null;
  }

  return <Header />;
}

