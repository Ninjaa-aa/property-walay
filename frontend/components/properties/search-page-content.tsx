"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PropertyFilters } from "./property-filters";
import { PropertyCard } from "./property-card";
import { PropertyPagination } from "./property-pagination";
import { PropertySkeleton } from "./property-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSearchUrl } from "@/lib/utils/search-params";
import type { PropertyListParams } from "@/types/api/property";

interface SearchPageContentProps {
  initialFilters: PropertyListParams;
}

export function SearchPageContent({ initialFilters }: SearchPageContentProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyListParams>(initialFilters);

  const { properties, loading, error, total, page, pageSize, totalPages } =
    useProperties(filters);

  const handleFiltersChange = useCallback(
    (newFilters: PropertyListParams) => {
      setFilters(newFilters);
      const url = getSearchUrl(newFilters);
      router.replace(url, { scroll: false });
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
      const url = getSearchUrl(newFilters);
      router.replace(url, { scroll: false });
    },
    [filters, router]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const newFilters = { ...filters, page_size: newPageSize, page: 1 };
      setFilters(newFilters);
      const url = getSearchUrl(newFilters);
      router.replace(url, { scroll: false });
    },
    [filters, router]
  );

  const handleSave = (propertyId: string) => {
    // TODO: Implement save functionality
    console.log("Save property:", propertyId);
  };

  const handleClearFilters = useCallback(() => {
    const clearedFilters: PropertyListParams = { page: 1, page_size: 20 };
    setFilters(clearedFilters);
    router.replace("/dashboard/search", { scroll: false });
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeIn delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl">Search Properties</h1>
          <p className="text-muted-foreground mt-2">
            Find your dream property in Pakistan
          </p>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.2}>
        <PropertyFilters
          key={JSON.stringify(filters)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalResults={total}
        />
      </FadeIn>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-destructive mb-4 text-6xl">⚠️</div>
            <h3 className="mb-2 text-lg font-semibold">
              Error Loading Properties
            </h3>
            <p className="text-muted-foreground mb-4 text-center text-sm">
              {error.detail || "An error occurred while loading properties"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchX className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-lg font-semibold">No Properties Found</h3>
            <p className="text-muted-foreground mb-4 text-center text-sm">
              Try adjusting your filters to see more results
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Property Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <FadeIn key={property.our_id} delay={0.1 + index * 0.05}>
                <PropertyCard property={property} onSave={handleSave} />
              </FadeIn>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <FadeIn delay={0.5}>
              <PropertyPagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
