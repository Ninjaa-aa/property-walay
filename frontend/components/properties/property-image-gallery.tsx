"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { getPropertyImage, getCleanedImages } from "@/lib/utils/property";
import type { ApiProperty } from "@/types/api/property";

interface PropertyImageGalleryProps {
  property: ApiProperty;
}

export function PropertyImageGallery({ property }: PropertyImageGalleryProps) {
  // Get all cleaned and valid image URLs
  const displayImages = getCleanedImages(property.images);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage =
    displayImages.length > 0
      ? displayImages[selectedIndex]
      : getPropertyImage(property);

  const nextImage = () => {
    if (displayImages.length > 0) {
      setSelectedIndex((prev) => (prev + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (displayImages.length > 0) {
      setSelectedIndex(
        (prev) => (prev - 1 + displayImages.length) % displayImages.length
      );
    }
  };

  const visibleThumbnails = displayImages.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
        {mainImage && mainImage !== "/placeholder-property.jpg" ? (
          <Image
            src={mainImage}
            alt={property.title || "Property image"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-linear-to-br">
            <span className="text-muted-foreground text-lg">
              No Image Available
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="bg-background/80 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium">
              {selectedIndex + 1} / {displayImages.length}
            </span>
          </div>
        )}

        {/* Fullscreen Button */}
        {displayImages.length > 0 &&
          mainImage !== "/placeholder-property.jpg" && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => window.open(mainImage, "_blank")}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {visibleThumbnails.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-video h-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                selectedIndex === index
                  ? "border-primary scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
          {displayImages.length > 6 && (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border-2 border-dashed">
              <span className="text-muted-foreground text-xs">
                +{displayImages.length - 6}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
