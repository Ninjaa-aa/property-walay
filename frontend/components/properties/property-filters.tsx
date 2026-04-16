"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Search, Filter } from "lucide-react";
import type { PropertyListParams } from "@/types/api/property";
import {
  bathOptions,
  bedOptions,
  listingTypeOptions,
  propertyTypeOptions,
  sourceOptions,
} from "@/data/properties/filters";

interface PropertyFiltersProps {
  filters: PropertyListParams;
  onFiltersChange: (filters: PropertyListParams) => void;
  totalResults?: number;
}

export function PropertyFilters({
  filters,
  onFiltersChange,
  totalResults,
}: PropertyFiltersProps) {
  // Initialize state from props - will be reset when component remounts with new key
  const [searchQuery, setSearchQuery] = useState(filters.area_name || "");
  const [localFilters, setLocalFilters] = useState<PropertyListParams>(filters);

  const handleFilterChange = (
    key: keyof PropertyListParams,
    value: unknown
  ) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 }; // Reset to page 1
    setLocalFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() === "") {
      const newFilters = { ...localFilters };
      delete newFilters.area_name;
      setLocalFilters(newFilters);
    }
  };

  const applyFilters = () => {
    const newFilters = { ...localFilters };
    if (searchQuery.trim()) {
      newFilters.area_name = searchQuery.trim();
    } else {
      delete newFilters.area_name;
    }
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: PropertyListParams = {
      page: 1,
      page_size: filters.page_size || 20,
    };
    setLocalFilters(clearedFilters);
    setSearchQuery("");
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = Object.keys(localFilters).filter(
    (key) =>
      key !== "page" &&
      key !== "page_size" &&
      localFilters[key as keyof PropertyListParams] !== undefined &&
      localFilters[key as keyof PropertyListParams] !== null
  ).length;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Search by location or area name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            className="pl-10"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Property Type */}
          <Select
            value={localFilters.prop_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "prop_type",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {propertyTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Listing Type */}
          <Select
            value={localFilters.listing_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "listing_type",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Listing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              {listingTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Beds */}
          <Select
            value={localFilters.beds?.toString() || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "beds",
                value === "all" ? undefined : parseInt(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Beds</SelectItem>
              {bedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Baths */}
          <Select
            value={localFilters.baths?.toString() || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "baths",
                value === "all" ? undefined : parseInt(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Baths</SelectItem>
              {bathOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source */}
          <Select
            value={localFilters.source || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "source",
                value === "all"
                  ? undefined
                  : (value as "graana" | "lamudi" | "zameen")
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Min Price */}
          <Input
            type="number"
            placeholder="Min Price (PKR)"
            value={localFilters.min_price || ""}
            onChange={(e) =>
              handleFilterChange(
                "min_price",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />

          {/* Max Price */}
          <Input
            type="number"
            placeholder="Max Price (PKR)"
            value={localFilters.max_price || ""}
            onChange={(e) =>
              handleFilterChange(
                "max_price",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge variant="secondary">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
                active
              </Badge>
            )}
            {totalResults !== undefined && (
              <span className="text-muted-foreground text-sm">
                {totalResults} propert{totalResults !== 1 ? "ies" : "y"} found
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={applyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
