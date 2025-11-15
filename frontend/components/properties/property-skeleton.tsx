import { Card } from "@/components/ui/card";

export function PropertySkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="bg-muted aspect-video w-full animate-pulse" />

      {/* Content Skeleton */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />

        {/* Location */}
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />

        {/* Price */}
        <div className="bg-muted h-8 w-1/3 animate-pulse rounded" />

        {/* Details */}
        <div className="flex gap-4">
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
        </div>

        {/* Button */}
        <div className="bg-muted mt-4 h-10 w-full animate-pulse rounded" />
      </div>
    </Card>
  );
}
