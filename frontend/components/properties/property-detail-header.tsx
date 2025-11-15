"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceFull } from "@/lib/utils/format-price";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { formatArea } from "@/lib/utils/format-area";
import { MapPin, Heart, Share2, ExternalLink } from "lucide-react";
import type { ApiProperty } from "@/types/api/property";

interface PropertyDetailHeaderProps {
  property: ApiProperty;
  onSave?: () => void;
  isSaved?: boolean;
}

const sourceColors: Record<string, string> = {
  zameen: "bg-blue-500",
  graana: "bg-purple-500",
  lamudi: "bg-orange-500",
};

export function PropertyDetailHeader({
  property,
  onSave,
  isSaved = false,
}: PropertyDetailHeaderProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title || "Property",
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title and Location */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold lg:text-4xl">
              {property.title || "Untitled Property"}
            </h1>
            <div className="text-muted-foreground mt-2 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">
                {property.area_name || "Unknown Location"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              className={saved ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Source Badge */}
        <div className="mt-4 flex items-center gap-2">
          <Badge
            className={`${sourceColors[property.source] || "bg-gray-500"} text-white`}
          >
            Listed on{" "}
            {property.source.charAt(0).toUpperCase() + property.source.slice(1)}
          </Badge>
          {property.link && (
            <Button variant="ghost" size="sm" asChild>
              <a href={property.link} target="_blank" rel="noopener noreferrer">
                View Original <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Key Details */}
      <div className="bg-card grid grid-cols-1 gap-4 rounded-lg border p-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-sm">Price</p>
          <p className="text-primary mt-1 text-3xl font-bold">
            {formatPriceFull(
              property.current_price || 0,
              property.currency || "PKR"
            )}
          </p>
        </div>
        {property.area_size && property.area_unit && (
          <div>
            <p className="text-muted-foreground text-sm">Area</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatArea(property.area_size, property.area_unit)}
            </p>
          </div>
        )}
        {property.beds !== null && property.beds !== undefined && (
          <div>
            <p className="text-muted-foreground text-sm">Bedrooms</p>
            <p className="mt-1 text-2xl font-semibold">{property.beds}</p>
          </div>
        )}
        {property.baths !== null && property.baths !== undefined && (
          <div>
            <p className="text-muted-foreground text-sm">Bathrooms</p>
            <p className="mt-1 text-2xl font-semibold">{property.baths}</p>
          </div>
        )}
      </div>

      {/* Updated Time */}
      <p className="text-muted-foreground text-sm">
        Last updated {formatRelativeTime(property.updated_at)}
      </p>
    </div>
  );
}
