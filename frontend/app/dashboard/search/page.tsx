import { Suspense, use } from "react";
import { SearchPageContent } from "@/components/properties/search-page-content";
import { parseSearchParams } from "@/lib/utils/search-params";

type SearchPageProps = {
  // Next may provide searchParams as a promise in React 19 + Turbopack.
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Server component wrapper so the page can parse query params without
 * forcing client rendering. The actual UI remains client-side in
 * `SearchPageContent`.
 */
function SearchPageInner({ searchParams }: SearchPageProps) {
  // Use React.use to unwrap a possibly promised searchParams, so it plays
  // nicely with React suspense semantics in the app router.
  const resolvedParams = use(Promise.resolve(searchParams));
  const params = new URLSearchParams();

  Object.entries(resolvedParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  const initialFilters = parseSearchParams(params);

  return <SearchPageContent initialFilters={initialFilters} />;
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageInner {...props} />
    </Suspense>
  );
}
