"use client";

import { useSearchParams } from "next/navigation";
import { SearchPageContent } from "@/components/properties/search-page-content";
import { parseSearchParams } from "@/lib/utils/search-params";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialFilters = parseSearchParams(searchParams);

  return <SearchPageContent initialFilters={initialFilters} />;
}
