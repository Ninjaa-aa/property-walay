"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatedCard } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceShort } from "@/lib/utils/format-price";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { formatAreaShort } from "@/lib/utils/format-area";
import { getPropertyImage } from "@/lib/utils/property";
import { Bed, Bath, MapPin, Heart } from "lucide-react";
import type { ApiProperty } from "@/types/api/property";
import { useState } from "react";
import { useSearchHistoryStore } from "@/lib/stores/search-history-store";

function shouldUnoptimizeImage(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    url.includes("zameen-dev.s3") ||
    url.includes("zameen.com") ||
    url.includes("graana.com") ||
    url.includes("images.graana.com")
  );
}

interface PropertyCardProps {
  property: ApiProperty;
  onSave?: (propertyId: string) => void;
  isSaved?: boolean;
}

const sourceColors: Record<string, string> = {
  zameen: "bg-blue-500",
  graana: "bg-purple-500",
  lamudi: "bg-orange-500",
};

const propertyTypeColors: Record<string, string> = {
  house: "bg-green-500",
  apartment: "bg-blue-500",
  plot: "bg-amber-500",
  commercial: "bg-purple-500",
};

const listingTypeColors: Record<string, string> = {
  sale: "bg-emerald-600",
  rent: "bg-sky-600",
};

export function PropertyCard({
  property,
  onSave,
  isSaved = false,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);
  const imageUrl = getPropertyImage(property);
  const recordPropertyView = useSearchHistoryStore((s) => s.recordPropertyView);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    onSave?.(property.our_id);
  };

  const handleClick = () => {
    recordPropertyView({
      propertyId: property.our_id,
      title: property.title || "Untitled Property",
      areaName: property.area_name || null,
      price: property.current_price || null,
      viewedAt: new Date().toISOString(),
    });
  };

  return (
    <AnimatedCard hoverEffect>
      <Link href={`/dashboard/search/${property.our_id}`} onClick={handleClick}>
        <div className="group bg-card overflow-hidden rounded-lg border transition-all hover:shadow-lg">
          {/* Image Section */}
          <div className="bg-muted relative aspect-video w-full overflow-hidden">
            {!imageError && imageUrl !== "/placeholder-property.jpg" ? (
              <Image
                src={imageUrl}
                alt={property.title || "Property"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={shouldUnoptimizeImage(imageUrl)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-linear-to-br">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}

            <Badge
              className={`absolute top-2 right-2 ${sourceColors[property.source] || "bg-gray-500"} text-white`}
            >
              {property.source.charAt(0).toUpperCase() +
                property.source.slice(1)}
            </Badge>

            {property.prop_type && (
              <Badge
                className={`absolute top-2 left-2 ${propertyTypeColors[property.prop_type] || "bg-gray-500"} text-white`}
              >
                {property.prop_type.charAt(0).toUpperCase() +
                  property.prop_type.slice(1)}
              </Badge>
            )}

            {property.listing_type && (
              <Badge
                className={`absolute top-12 left-2 ${listingTypeColors[property.listing_type] || "bg-gray-500"} text-white`}
              >
                {property.listing_type.charAt(0).toUpperCase() +
                  property.listing_type.slice(1)}
              </Badge>
            )}

            <button
              onClick={handleSave}
              className="bg-background/80 hover:bg-background absolute right-2 bottom-2 rounded-full p-2 backdrop-blur-sm transition-colors"
              aria-label={saved ? "Remove from saved" : "Save property"}
            >
              <Heart
                className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
              />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h3 className="line-clamp-2 text-lg leading-tight font-semibold">
              {property.title || "Untitled Property"}
            </h3>

            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {property.area_name || "Unknown Location"}
              </span>
            </div>

            <p className="text-primary mt-2 text-2xl font-bold">
              {formatPriceShort(
                property.current_price || 0,
                property.currency || "PKR"
              )}
            </p>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
              {property.beds !== null && property.beds !== undefined && (
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {property.beds}
                </span>
              )}
              {property.baths !== null && property.baths !== undefined && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.baths}
                </span>
              )}
              {property.area_size && property.area_unit && (
                <span>
                  {formatAreaShort(property.area_size, property.area_unit)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mt-2 text-xs">
              Updated {formatRelativeTime(property.updated_at)}
            </p>

            <Button className="mt-4 w-full" variant="default">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </AnimatedCard>
  );
}
