"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TrendsOverview } from "@/components/trends/trends-overview";
import { TrendsFilters } from "@/components/trends/trends-filters";
import { TrendsCharts } from "@/components/trends/trends-charts";
import { TrendsTable } from "@/components/trends/trends-table";
import { TopMovers } from "@/components/trends/top-movers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendsCategory } from "@/types/api/trends";

// Dynamically import TrendsMap to avoid SSR issues with Leaflet
const TrendsMap = dynamic(
  () =>
    import("@/components/trends/trends-map").then((mod) => ({
      default: mod.TrendsMap,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
  }
);

export default function TrendsPage() {
  const [category, setCategory] = useState<TrendsCategory>("buying");
  const [selectedRegionId, setSelectedRegionId] = useState<
    number | undefined
  >();
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Market Trends</h1>
        <p className="text-muted-foreground">
          Explore real estate market trends across Pakistan. Analyze location
          performance, view rankings, and discover investment opportunities.
        </p>
      </div>

      {/* Filters */}
      <TrendsFilters
        category={category}
        onCategoryChange={setCategory}
        selectedRegionId={selectedRegionId}
        onRegionChange={setSelectedRegionId}
        selectedCityId={selectedCityId}
        onCityChange={setSelectedCityId}
      />

      {/* Overview Stats */}
      <TrendsOverview category={category} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <TopMovers category={category} direction="up" />
            <TopMovers category={category} direction="down" />
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <TrendsMap
            category={category}
            regionId={selectedRegionId}
            cityId={selectedCityId}
          />
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <TrendsCharts category={category} cityId={selectedCityId} />
        </TabsContent>

        <TabsContent value="rankings" className="mt-6">
          <TrendsTable category={category} cityId={selectedCityId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
