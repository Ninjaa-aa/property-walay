"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname === "/forgot-password";

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
