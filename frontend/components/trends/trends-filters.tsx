"use client";

import { useRegions, useCities } from "@/hooks/use-trends";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Building2, Home, MapPin } from "lucide-react";
import type { TrendsCategory } from "@/types/api/trends";

interface TrendsFiltersProps {
  category: TrendsCategory;
  onCategoryChange: (category: TrendsCategory) => void;
  selectedRegionId?: number;
  onRegionChange: (regionId: number | undefined) => void;
  selectedCityId?: number;
  onCityChange: (cityId: number | undefined) => void;
}

export function TrendsFilters({
  category,
  onCategoryChange,
  selectedRegionId,
  onRegionChange,
  selectedCityId,
  onCityChange,
}: TrendsFiltersProps) {
  const { regions, loading: regionsLoading } = useRegions();
  const { cities, loading: citiesLoading } = useCities(
    selectedRegionId
      ? { region_id: selectedRegionId, limit: 200 }
      : { limit: 200 }
  );

  const handleRegionChange = (value: string) => {
    if (value === "all") {
      onRegionChange(undefined);
      onCityChange(undefined);
    } else {
      onRegionChange(parseInt(value));
      onCityChange(undefined);
    }
  };

  const handleCityChange = (value: string) => {
    if (value === "all") {
      onCityChange(undefined);
    } else {
      onCityChange(parseInt(value));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* Category Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Market Category</Label>
            <ToggleGroup
              type="single"
              value={category}
              onValueChange={(value: string) =>
                value && onCategoryChange(value as TrendsCategory)
              }
              className="justify-start"
            >
              <ToggleGroupItem
                value="buying"
                aria-label="Buying"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-2"
              >
                <Home className="h-4 w-4" />
                Buying
              </ToggleGroupItem>
              <ToggleGroupItem
                value="renting"
                aria-label="Renting"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-2"
              >
                <Building2 className="h-4 w-4" />
                Renting
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Location Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {/* Region Select */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                Region / Province
              </Label>
              <Select
                value={selectedRegionId?.toString() || "all"}
                onValueChange={handleRegionChange}
                disabled={regionsLoading}
              >
                <SelectTrigger id="region" className="w-[200px]">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Select */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Select
                value={selectedCityId?.toString() || "all"}
                onValueChange={handleCityChange}
                disabled={citiesLoading}
              >
                <SelectTrigger id="city" className="w-[200px]">
                  <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
