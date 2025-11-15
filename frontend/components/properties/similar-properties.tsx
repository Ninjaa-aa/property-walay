"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatPriceShort } from "@/lib/utils/format-price";
import { getPropertyImage } from "@/lib/utils/property";
import { MapPin } from "lucide-react";
import type { ApiProperty } from "@/types/api/property";

interface SimilarPropertiesProps {
  properties: ApiProperty[];
  currentPropertyId: string;
}

export function SimilarProperties({
  properties,
  currentPropertyId,
}: SimilarPropertiesProps) {
  // Filter out current property and limit to 4
  const similar = properties
    .filter((p) => p.our_id !== currentPropertyId)
    .slice(0, 4);

  if (similar.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similar.map((property) => {
          const imageUrl = getPropertyImage(property);
          return (
            <Link
              key={property.our_id}
              href={`/dashboard/search/${property.our_id}`}
              className="group hover:bg-muted flex gap-4 rounded-lg border p-3 transition-colors"
            >
              <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={imageUrl}
                  alt={property.title || "Property"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="group-hover:text-primary line-clamp-2 font-semibold">
                  {property.title || "Untitled Property"}
                </h4>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">
                    {property.area_name || "Unknown"}
                  </span>
                </div>
                <p className="text-primary mt-1 font-semibold">
                  {formatPriceShort(
                    property.current_price || 0,
                    property.currency || "PKR"
                  )}
                </p>
              </div>
            </Link>
          );
        })}
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/search">View All Properties</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
