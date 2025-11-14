import { NotFoundContent } from "@/components/not-found/not-found-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Property Walay",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
