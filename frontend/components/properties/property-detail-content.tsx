"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyImageGallery } from "./property-image-gallery";
import { PropertyDetailHeader } from "./property-detail-header";
import { ContactAgentCard } from "./contact-agent-card";
import { SimilarProperties } from "./similar-properties";
import { GeneratePptButton } from "@/components/properties/ppt-generation/generate-ppt-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProperty, getRecommendedProperties } from "@/lib/api/properties";
import { formatPriceFull } from "@/lib/utils/format-price";
import { formatAbsoluteDate } from "@/lib/utils/format-date";
import { formatArea } from "@/lib/utils/format-area";
import { generatePropertyDescription } from "@/lib/utils/property-description";
import { MapPin, Share2 } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { ApiClientError } from "@/lib/api/client";
import type { ApiProperty } from "@/types/api/property";
import { useSearchHistoryStore } from "@/lib/stores/search-history-store";

interface PropertyDetailContentProps {
  propertyId: string;
}

export function PropertyDetailContent({
  propertyId,
}: PropertyDetailContentProps) {
  const router = useRouter();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [similarProperties, setSimilarProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const recordPropertyView = useSearchHistoryStore((s) => s.recordPropertyView);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const [propertyData, similarData] = await Promise.all([
          getProperty(propertyId),
          getRecommendedProperties(4),
        ]);

        setProperty(propertyData);
        setSimilarProperties(similarData);

        recordPropertyView({
          propertyId: propertyData.our_id,
          title: propertyData.title || "Untitled Property",
          areaName: propertyData.area_name || null,
          price: propertyData.current_price || null,
          viewedAt: new Date().toISOString(),
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.detail);
        } else {
          setError("Failed to load property details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, recordPropertyView]);

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleScheduleMeeting = () => {
    console.log("Schedule meeting for property:", propertyId);
  };

  const handleSendMessage = () => {
    console.log("Send message for property:", propertyId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-destructive mb-4 text-6xl">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold">Property Not Found</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            {error || "The property you're looking for doesn't exist"}
          </p>
          <Button onClick={() => router.push("/dashboard/search")}>
            Back to Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  const description = generatePropertyDescription(property);

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FadeIn delay={0.2}>
            <PropertyImageGallery property={property} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <PropertyDetailHeader
              property={property}
              onSave={handleSave}
              isSaved={saved}
            />
          </FadeIn>

          <FadeIn delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">
                  {property.area_name || "Location not specified"}
                </p>
                {property.latitude && property.longitude ? (
                  <div className="bg-muted aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                      allowFullScreen
                      title="Property location"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Map location not available
                  </p>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.6}>
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Property ID</p>
                    <p className="mt-1 font-medium">
                      {property.source_human_id || property.source_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Source</p>
                    <Badge className="mt-1">
                      {property.source.charAt(0).toUpperCase() +
                        property.source.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Property Type
                    </p>
                    <p className="mt-1 font-medium">
                      {property.prop_type
                        ? property.prop_type.charAt(0).toUpperCase() +
                          property.prop_type.slice(1)
                        : "N/A"}
                      {property.prop_subtype && ` - ${property.prop_subtype}`}
                    </p>
                  </div>
                  {property.area_size && property.area_unit && (
                    <div>
                      <p className="text-muted-foreground text-sm">Area</p>
                      <p className="mt-1 font-medium">
                        {formatArea(property.area_size, property.area_unit)}
                      </p>
                    </div>
                  )}
                  {property.current_price && property.area_size && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Price per {property.area_unit || "unit"}
                      </p>
                      <p className="mt-1 font-medium">
                        {formatPriceFull(
                          Math.round(
                            property.current_price / property.area_size
                          ),
                          property.currency || "PKR"
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-sm">Listed on</p>
                    <p className="mt-1 font-medium">
                      {formatAbsoluteDate(property.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Last updated
                    </p>
                    <p className="mt-1 font-medium">
                      {formatAbsoluteDate(property.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.7}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share & Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <GeneratePptButton
                    propertyId={property.our_id}
                    propertyTitle={property.title || undefined}
                    variant="default"
                    size="lg"
                  />
                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Property
                  </Button>
                </div>
                <p className="text-muted-foreground mt-3 text-sm">
                  Generate a professional PowerPoint presentation with all
                  property details, images, and contact information.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="space-y-6">
          <FadeIn delay={0.3}>
            <ContactAgentCard
              agentName={property.poc_name}
              phoneNumber={property.poc_number}
              onScheduleMeeting={handleScheduleMeeting}
              onSendMessage={handleSendMessage}
            />
          </FadeIn>

          {similarProperties.length > 0 && (
            <FadeIn delay={0.4}>
              <SimilarProperties
                properties={similarProperties}
                currentPropertyId={property.our_id}
              />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
