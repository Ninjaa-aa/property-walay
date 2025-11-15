"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const hideFooter =
    isDashboard ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname === "/forgot-password";

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
