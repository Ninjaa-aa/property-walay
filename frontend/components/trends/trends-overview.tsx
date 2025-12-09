"use client";

import { useTrendsSummary, useAnalyticsOverview } from "@/hooks/use-trends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Building2,
  TrendingUp,
  Eye,
  BarChart3,
  Globe,
} from "lucide-react";
import type { TrendsCategory } from "@/types/api/trends";

interface TrendsOverviewProps {
  category: TrendsCategory;
}

export function TrendsOverview({ category }: TrendsOverviewProps) {
  const { summary, loading: summaryLoading } = useTrendsSummary();
  const { analytics, loading: analyticsLoading } =
    useAnalyticsOverview(category);

  const loading = summaryLoading || analyticsLoading;

  const stats = [
    {
      title: "Total Regions",
      value: summary?.total_regions || 0,
      icon: Globe,
      description: "Provinces covered",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Cities",
      value: summary?.total_cities || 0,
      icon: Building2,
      description: "Cities tracked",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Locations",
      value: summary?.total_locations || 0,
      icon: MapPin,
      description: "Neighborhoods monitored",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      title: "Total Views",
      value: analytics?.total_views?.toLocaleString() || "0",
      icon: Eye,
      description: `${category === "buying" ? "Buying" : "Renting"} searches`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Avg. Search %",
      value: `${analytics?.average_search_percentage || 0}%`,
      icon: BarChart3,
      description: "Market interest",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: category === "buying" ? "Buying Locations" : "Renting Locations",
      value:
        category === "buying"
          ? summary?.buying_locations || 0
          : summary?.renting_locations || 0,
      icon: TrendingUp,
      description: "Active listings",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {stat.description}
              </p>
            </CardContent>
            <div
              className={`absolute right-0 bottom-0 left-0 h-1 ${stat.bgColor}`}
              style={{ opacity: 0.5 }}
            />
          </Card>
        );
      })}
    </div>
  );
}
