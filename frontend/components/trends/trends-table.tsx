"use client";

import { useState } from "react";
import { useTopLocations, useCities } from "@/hooks/use-trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
} from "lucide-react";
import type { TrendsCategory } from "@/types/api/trends";

interface TrendsTableProps {
  category: TrendsCategory;
  cityId?: number;
}

export function TrendsTable({
  category,
  cityId: initialCityId,
}: TrendsTableProps) {
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(
    initialCityId
  );
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { cities, loading: citiesLoading } = useCities({ limit: 200 });
  const { locations, loading, error } = useTopLocations(
    selectedCityId || 1,
    category,
    50
  );

  // Pagination
  const totalPages = Math.ceil(locations.length / pageSize);
  const paginatedLocations = locations.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCityChange = (value: string) => {
    setSelectedCityId(parseInt(value));
    setPage(1);
  };

  if (loading || citiesLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-60" />
            </div>
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5" />
            Location Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Failed to load rankings data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="text-primary h-5 w-5" />
              Location Rankings
            </CardTitle>
            <CardDescription>
              Detailed rankings for{" "}
              {category === "buying" ? "buying" : "renting"} trends
            </CardDescription>
          </div>
          <Select
            value={selectedCityId?.toString() || ""}
            onValueChange={handleCityChange}
          >
            <SelectTrigger className="w-[200px]">
              <Search className="text-muted-foreground mr-2 h-4 w-4" />
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedCityId ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                Select a city to view rankings
              </p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <ListOrdered className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                No rankings available for this city
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Change</TableHead>
                    <TableHead className="text-right">Search %</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLocations.map((location) => (
                    <TableRow key={location.location_id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{location.current_position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{location.title}</p>
                          {location.title_urdu && (
                            <p
                              className="text-muted-foreground text-xs"
                              dir="rtl"
                            >
                              {location.title_urdu}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <PositionChange change={location.position_change} />
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">
                          {location.current_search_percentage?.toFixed(1) ||
                            "0"}
                          %
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Eye className="text-muted-foreground h-3 w-3" />
                          <span>
                            {location.current_view_count?.toLocaleString() ||
                              "0"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, locations.length)} of{" "}
                  {locations.length} locations
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface PositionChangeProps {
  change?: number | null;
}

function PositionChange({ change }: PositionChangeProps) {
  if (!change || change === 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Minus className="h-3 w-3" />0
      </Badge>
    );
  }

  if (change > 0) {
    return (
      <Badge className="gap-1 bg-emerald-500 hover:bg-emerald-600">
        <ArrowUp className="h-3 w-3" />
        {change}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-1">
      <ArrowDown className="h-3 w-3" />
      {Math.abs(change)}
    </Badge>
  );
}
