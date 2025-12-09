"use client";

import { useState, useEffect, useRef } from "react";
import { useAnalyticsOverview, useTopLocations } from "@/hooks/use-trends";
import { getLocationHistory } from "@/lib/api/trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import type { TrendsCategory, LocationHistory } from "@/types/api/trends";

interface TrendsChartsProps {
  category: TrendsCategory;
  cityId?: number;
}

export function TrendsCharts({ category, cityId }: TrendsChartsProps) {
  const { analytics, loading: analyticsLoading } =
    useAnalyticsOverview(category);
  const { locations: topLocations } = useTopLocations(
    cityId || 1, // Default to first city if none selected
    category,
    5
  );

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [locationHistory, setLocationHistory] =
    useState<LocationHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const locationHistoryRef = useRef<LocationHistory | null>(null);

  // Fetch location history when selection changes
  useEffect(() => {
    if (!selectedLocationId) {
      if (locationHistoryRef.current !== null) {
        locationHistoryRef.current = null;
        queueMicrotask(() => {
          setLocationHistory(null);
        });
      }
      return;
    }

    queueMicrotask(() => {
      setHistoryLoading(true);
    });
    getLocationHistory(selectedLocationId, category, 12)
      .then((data) => {
        locationHistoryRef.current = data;
        setLocationHistory(data);
      })
      .catch(() => {
        locationHistoryRef.current = null;
        setLocationHistory(null);
      })
      .finally(() => setHistoryLoading(false));
  }, [selectedLocationId, category]);

  // Set default selection when top locations load
  useEffect(() => {
    if (topLocations.length > 0 && !selectedLocationId) {
      queueMicrotask(() => {
        setSelectedLocationId(topLocations[0].location_id);
      });
    }
  }, [topLocations, selectedLocationId]);

  if (analyticsLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Top Cities Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-primary h-5 w-5" />
            Top Cities by Views
          </CardTitle>
          <CardDescription>
            Cities with highest {category === "buying" ? "buying" : "renting"}{" "}
            interest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.top_cities.map((city, index) => {
              const maxViews = analytics.top_cities[0]?.total_views || 1;
              const percentage = (city.total_views / maxViews) * 100;

              return (
                <div key={city.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-6 text-sm font-medium">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{city.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {city.total_views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="bg-muted h-3 overflow-hidden rounded-full">
                    <div
                      className="from-primary to-primary/60 h-full rounded-full bg-linear-to-r transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {(!analytics?.top_cities || analytics.top_cities.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No city data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Region Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="text-primary h-5 w-5" />
              Region Distribution
            </CardTitle>
            <CardDescription>Locations per region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.region_distribution.map((region) => {
                const totalLocations = analytics.region_distribution.reduce(
                  (sum, r) => sum + r.location_count,
                  0
                );
                const percentage = totalLocations
                  ? Math.round((region.location_count / totalLocations) * 100)
                  : 0;

                return (
                  <div
                    key={region.id}
                    className="flex items-center justify-between border-b py-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{region.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {region.city_count} cities • {region.location_count}{" "}
                        locations
                      </p>
                    </div>
                    <Badge variant="secondary">{percentage}%</Badge>
                  </div>
                );
              })}

              {(!analytics?.region_distribution ||
                analytics.region_distribution.length === 0) && (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No region data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Trend Line Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="text-primary h-5 w-5" />
                  Location Trend
                </CardTitle>
                <CardDescription>Monthly performance over time</CardDescription>
              </div>
              {topLocations.length > 0 && (
                <Select
                  value={selectedLocationId?.toString() || ""}
                  onValueChange={(v) => setSelectedLocationId(parseInt(v))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {topLocations.map((loc) => (
                      <SelectItem
                        key={loc.location_id}
                        value={loc.location_id.toString()}
                      >
                        {loc.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : locationHistory ? (
              <div className="space-y-4">
                {/* Simple Line Chart Visualization */}
                <div className="relative h-[200px] border-b border-l">
                  <div className="absolute inset-0 flex items-end justify-between gap-1 px-2 pb-1">
                    {locationHistory.view_counts.map((count, index) => {
                      const maxCount = Math.max(
                        ...locationHistory.view_counts,
                        1
                      );
                      const height = (count / maxCount) * 100;

                      return (
                        <div
                          key={index}
                          className="group flex flex-1 flex-col items-center justify-end"
                        >
                          <div
                            className="from-primary to-primary/40 hover:from-primary/90 w-full rounded-t bg-linear-to-t transition-all duration-300"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                          <div className="text-muted-foreground absolute -bottom-6 text-[10px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                            {locationHistory.labels[index]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {locationHistory.view_counts
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs">Total Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.max(
                        ...locationHistory.view_counts
                      ).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs">Peak Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(
                        locationHistory.view_counts.reduce((a, b) => a + b, 0) /
                          locationHistory.view_counts.length
                      ).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs">Avg/Month</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    {cityId
                      ? "Select a location to view trends"
                      : "Select a city first"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
