"use client";

import Image from "next/image";
import { Bath, BedDouble, ExternalLink, MapPin, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WebhookProperty } from "@/types/chatbot";

function formatPrice(price?: number, currency?: string) {
  if (!price) return "N/A";
  const c = currency ?? "PKR";
  if (price >= 10_000_000) return `${c} ${(price / 10_000_000).toFixed(1)} Cr`;
  if (price >= 100_000) return `${c} ${(price / 100_000).toFixed(1)} Lac`;
  return `${c} ${price.toLocaleString()}`;
}

function cleanImageUrl(url?: string): string | null {
  if (!url) return null;
  return url.startsWith("@") ? url.slice(1) : url;
}

interface ChatPropertyCardProps {
  property: WebhookProperty;
}

export function ChatPropertyCard({ property }: ChatPropertyCardProps) {
  const image = cleanImageUrl(property.images?.[0]);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      {image && (
        <div className="relative h-36 w-full">
          <Image
            src={image}
            alt={property.title ?? "Property"}
            fill
            className="object-cover"
            sizes="(max-width: 400px) 100vw, 300px"
            unoptimized
          />
          {property.listing_type && (
            <Badge className="absolute top-2 left-2 capitalize">
              {property.listing_type}
            </Badge>
          )}
        </div>
      )}
      <div className="space-y-2 p-3">
        <p className="text-sm font-semibold leading-tight">
          {property.title ?? "Property"}
        </p>

        <p className="text-primary text-sm font-bold">
          {formatPrice(property.current_price, property.currency)}
        </p>

        {property.area_name && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3" />
            {property.area_name}
          </p>
        )}

        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {property.beds != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3 w-3" /> {property.beds}
            </span>
          )}
          {property.baths != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" /> {property.baths}
            </span>
          )}
          {property.area_size != null && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" /> {property.area_size}{" "}
              {property.area_unit}
            </span>
          )}
        </div>

        {property.link && (
          <a
            href={property.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
          >
            View listing <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </Card>
  );
}
