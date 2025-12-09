"use client";

import { useTopMovers } from "@/hooks/use-trends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import type { TrendsCategory } from "@/types/api/trends";

interface TopMoversProps {
  category: TrendsCategory;
  direction: "up" | "down";
  limit?: number;
}

export function TopMovers({ category, direction, limit = 10 }: TopMoversProps) {
  const { movers, loading, error } = useTopMovers(category, direction, limit);

  const isUp = direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const title = isUp ? "Top Gainers" : "Top Decliners";
  const description = isUp
    ? "Locations with biggest ranking improvements"
    : "Locations with biggest ranking drops";

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              className={`h-5 w-5 ${isUp ? "text-emerald-500" : "text-rose-500"}`}
            />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Failed to load data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon
            className={`h-5 w-5 ${isUp ? "text-emerald-500" : "text-rose-500"}`}
          />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {movers.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No significant changes this period
          </p>
        ) : (
          <div className="space-y-3">
            {movers.map((mover, index) => (
              <div
                key={`${mover.location_id}-${mover.city_id}`}
                className="flex items-center justify-between border-b py-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-6 text-sm font-medium">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {mover.location_title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {mover.city_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PositionBadge
                    current={mover.current_position}
                    change={mover.position_change}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PositionBadgeProps {
  current: number;
  change: number;
}

function PositionBadge({ current, change }: PositionBadgeProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">#{current}</span>
      <Badge
        variant={
          isPositive ? "default" : isNegative ? "destructive" : "secondary"
        }
        className={`flex items-center gap-1 ${
          isPositive ? "bg-emerald-500 hover:bg-emerald-600" : ""
        }`}
      >
        {isPositive ? (
          <ArrowUp className="h-3 w-3" />
        ) : isNegative ? (
          <ArrowDown className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
        {Math.abs(change)}
      </Badge>
    </div>
  );
}
