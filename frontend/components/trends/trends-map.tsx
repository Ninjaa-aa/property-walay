"use client";

import { useMapLocations } from "@/hooks/use-trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, TrendingDown, Eye } from "lucide-react";
import type { TrendsCategory, MapLocation } from "@/types/api/trends";

interface TrendsMapProps {
  category: TrendsCategory;
  regionId?: number;
  cityId?: number;
}

export function TrendsMap({ category, regionId, cityId }: TrendsMapProps) {
  const { locations, loading, error } = useMapLocations({
    region_id: regionId,
    city_id: cityId,
    category,
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Map
          </CardTitle>
          <CardDescription>
            Geographic distribution of trending locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Failed to load map data
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group locations by approximate grid for visualization
  const locationsByPosition = locations.reduce(
    (acc, loc) => {
      const key = loc.position
        ? `pos-${Math.ceil(loc.position / 10)}`
        : "unranked";
      if (!acc[key]) acc[key] = [];
      acc[key].push(loc);
      return acc;
    },
    {} as Record<string, MapLocation[]>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="text-primary h-5 w-5" />
          Location Map
        </CardTitle>
        <CardDescription>
          {locations.length} locations with coordinates •{" "}
          {category === "buying" ? "Buying" : "Renting"} trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder - In production, integrate with Mapbox/Google Maps/Leaflet */}
        <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {/* Pakistan Map Outline SVG Background */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 600" className="h-full w-full">
              <path
                d="M200,100 L300,80 L400,100 L500,150 L600,200 L650,300 L600,400 L500,450 L400,500 L300,480 L200,400 L150,300 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Location Grid */}
          <div className="relative min-h-[500px] p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {locations.slice(0, 20).map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>

            {locations.length > 20 && (
              <div className="mt-6 text-center">
                <Badge variant="secondary" className="text-sm">
                  +{locations.length - 20} more locations
                </Badge>
              </div>
            )}

            {locations.length === 0 && (
              <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    No locations found for the selected filters
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="bg-background/90 absolute bottom-4 left-4 rounded-lg border p-3 shadow-sm backdrop-blur-sm">
            <p className="mb-2 text-xs font-medium">Position Legend</p>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>Top 10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span>11-50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-400" />
                <span>51+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note about map integration */}
        <p className="text-muted-foreground mt-4 text-center text-xs">
          💡 For full interactive map, integrate with Mapbox, Google Maps, or
          Leaflet
        </p>
      </CardContent>
    </Card>
  );
}

interface LocationCardProps {
  location: MapLocation;
}

function LocationCard({ location }: LocationCardProps) {
  const positionColor =
    location.position && location.position <= 10
      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
      : location.position && location.position <= 50
        ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
        : "border-slate-300 bg-slate-50 dark:bg-slate-900";

  const changeIcon =
    location.position_change && location.position_change > 0 ? (
      <TrendingUp className="h-3 w-3 text-emerald-500" />
    ) : location.position_change && location.position_change < 0 ? (
      <TrendingDown className="h-3 w-3 text-rose-500" />
    ) : null;

  return (
    <div
      className={`rounded-lg border-2 p-3 transition-all hover:shadow-md ${positionColor}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{location.title}</p>
          {location.position && (
            <div className="mt-1 flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                #{location.position}
              </Badge>
              {changeIcon}
              {location.position_change && (
                <span
                  className={`text-xs ${
                    location.position_change > 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {location.position_change > 0 ? "+" : ""}
                  {location.position_change}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {location.view_count && (
        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
          <Eye className="h-3 w-3" />
          <span>{location.view_count.toLocaleString()} views</span>
        </div>
      )}
    </div>
  );
}
