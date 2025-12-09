"use client";

import { useEffect, useRef, useMemo } from "react";
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
import { MapPin, Eye } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TrendsCategory, MapLocation } from "@/types/api/trends";

// Fix for default marker icons in Next.js/React
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to ensure map is properly sized
function MapResizer() {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if map and its container are ready
    if (!map || !map.getContainer()) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Use a longer delay to ensure DOM is ready
    timeoutRef.current = setTimeout(() => {
      try {
        if (map && map.getContainer()) {
          map.invalidateSize();
        }
      } catch (error) {
        // Silently handle errors during map initialization
        console.warn("Map resize error:", error);
      }
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [map]);

  return null;
}

// Component to fit map bounds to markers
function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  // Memoize bounds calculation to avoid unnecessary recalculations
  const bounds = useMemo(() => {
    if (locations.length === 0) return null;
    try {
      return L.latLngBounds(
        locations.map(
          (loc) => [loc.latitude, loc.longitude] as [number, number]
        )
      );
    } catch {
      return null;
    }
  }, [locations]);

  useEffect(() => {
    if (bounds && map) {
      // Use whenReady to ensure map is fully initialized
      const fitBounds = () => {
        try {
          if (!map || !map.getContainer()) {
            return;
          }
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } catch (error) {
          console.warn("Fit bounds error:", error);
        }
      };

      if (map.whenReady) {
        map.whenReady(fitBounds);
      } else {
        // Fallback if whenReady is not available
        setTimeout(fitBounds, 300);
      }
    }
  }, [bounds, map]);

  return null;
}

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

  // Generate a unique key based on props to force map recreation when they change
  const mapKey = `${category}-${regionId ?? "none"}-${cityId ?? "none"}`;

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

  // Calculate center point (Pakistan center) as fallback
  const center: [number, number] = [30.3753, 69.3451];

  // Filter locations with valid coordinates
  const validLocations = locations.filter(
    (loc) =>
      loc.latitude && loc.longitude && loc.latitude > 0 && loc.longitude > 0
  );

  // Create custom icons based on position
  const createCustomIcon = (position?: number | null) => {
    let color = "#94a3b8"; // Default gray
    if (position) {
      if (position <= 10)
        color = "#10b981"; // Emerald for top 10
      else if (position <= 50) color = "#f59e0b"; // Amber for 11-50
    }

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="text-primary h-5 w-5" />
          Location Map
        </CardTitle>
        <CardDescription>
          {validLocations.length} locations with coordinates •{" "}
          {category === "buying" ? "Buying" : "Renting"} trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validLocations.length === 0 ? (
          <div className="bg-muted/50 flex h-[500px] items-center justify-center rounded-lg border">
            <div className="text-center">
              <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                No locations found for the selected filters
              </p>
            </div>
          </div>
        ) : (
          <div className="relative h-[600px] w-full overflow-hidden rounded-lg border">
            <MapContainer
              key={`map-${mapKey}`}
              center={center}
              zoom={6}
              className="z-0 h-full w-full"
              scrollWheelZoom={true}
              style={{
                height: "100%",
                width: "100%",
                zIndex: 0,
                position: "relative",
              }}
            >
              <MapResizer />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                subdomains={["a", "b", "c", "d"]}
                maxZoom={19}
                minZoom={1}
              />
              <FitBounds locations={validLocations} />
              {validLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                  icon={createCustomIcon(location.position)}
                >
                  <Popup>
                    <div
                      className="min-w-[200px] p-2"
                      style={{ color: "#1f2937" }}
                    >
                      <h3
                        className="mb-2 text-sm font-semibold"
                        style={{ color: "#111827" }}
                      >
                        {location.title}
                      </h3>
                      <div className="space-y-1 text-xs">
                        {location.position && (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                color: "#374151",
                                borderColor: "#d1d5db",
                                backgroundColor: "#f9fafb",
                              }}
                            >
                              Rank #{location.position}
                            </Badge>
                            {location.position_change !== null &&
                              location.position_change !== undefined && (
                                <span
                                  className="text-xs font-medium"
                                  style={{
                                    color:
                                      location.position_change > 0
                                        ? "#059669"
                                        : location.position_change < 0
                                          ? "#dc2626"
                                          : "#6b7280",
                                  }}
                                >
                                  {location.position_change > 0
                                    ? "↑"
                                    : location.position_change < 0
                                      ? "↓"
                                      : "→"}{" "}
                                  {Math.abs(location.position_change || 0)}
                                </span>
                              )}
                          </div>
                        )}
                        {location.view_count && (
                          <div
                            className="flex items-center gap-1"
                            style={{ color: "#6b7280" }}
                          >
                            <Eye
                              className="h-3 w-3"
                              style={{ color: "#6b7280" }}
                            />
                            <span>
                              {location.view_count.toLocaleString()} views
                            </span>
                          </div>
                        )}
                        {location.search_percentage && (
                          <div style={{ color: "#6b7280" }}>
                            Search: {location.search_percentage.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend */}
            <div className="bg-background/95 absolute bottom-4 left-4 z-50 rounded-lg border p-3 shadow-lg backdrop-blur-sm">
              <p className="mb-2 text-xs font-medium">Position Legend</p>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-white bg-emerald-500" />
                  <span>Top 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-white bg-amber-500" />
                  <span>11-50</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-white bg-slate-400" />
                  <span>51+</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
