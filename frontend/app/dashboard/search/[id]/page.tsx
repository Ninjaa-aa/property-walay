"use client";

import { useParams } from "next/navigation";
import { PropertyDetailContent } from "@/components/properties/property-detail-content";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  return <PropertyDetailContent propertyId={propertyId} />;
}
