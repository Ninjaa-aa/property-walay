import Link from "next/link";
import Image from "next/image";
import { AnimatedCard } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/dashboard";
import { ArrowRight, Bath, Bed } from "lucide-react";
import type { DashboardProperty } from "@/types/dashboard";

interface PropertyCardProps {
  property: DashboardProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <AnimatedCard hoverEffect>
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{property.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {property.location}, {property.city}
          </p>
          <p className="text-primary mt-2 text-lg font-bold">
            {formatPrice(property.price, property.currency)}
          </p>
          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
            {property.beds && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.beds}
              </span>
            )}
            {property.baths && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.baths}
              </span>
            )}
            {property.size && property.sizeUnit && (
              <span>
                {property.size} {property.sizeUnit}
              </span>
            )}
          </div>
          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link href={`/dashboard/properties/${property.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </AnimatedCard>
  );
}
