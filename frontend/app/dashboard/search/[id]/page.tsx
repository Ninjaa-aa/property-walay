"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { PropertyDetailContent } from "@/components/properties/property-detail-content";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6 text-sm">
          Loading property...
        </div>
      }
    >
      <PropertyDetailContent propertyId={propertyId} />
    </Suspense>
  );
}
