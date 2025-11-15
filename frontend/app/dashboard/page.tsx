"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn, AnimatedCard } from "@/components/animations";
import { dashboardStats, statIcons } from "@/data/dashboard/stats";
import { dashboardActivities } from "@/data/dashboard/activities";
import { recommendedProperties } from "@/data/dashboard/properties";
import { priceAlerts } from "@/data/dashboard/price-alerts";
import { upcomingMeetings } from "@/data/dashboard/meetings";
import type { StatCard, Activity, DashboardProperty } from "@/types/dashboard";
import {
  Search,
  Bookmark,
  TrendingUp,
  Save,
  TrendingDown,
  Sparkles,
  Calendar,
  Bell,
  Bed,
  Bath,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function formatPrice(price: number, currency: "PKR" | "USD"): string {
  if (currency === "PKR") {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(0)} Lac`;
    }
    return `PKR ${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString()}`;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "save":
      return Save;
    case "price_change":
      return TrendingDown;
    case "new_matches":
      return Sparkles;
    case "meeting":
      return Calendar;
    case "view":
      return ExternalLink;
    default:
      return Bell;
  }
}

function getActivityColor(type: Activity["type"]) {
  switch (type) {
    case "save":
      return "bg-blue-500";
    case "price_change":
      return "bg-green-500";
    case "new_matches":
      return "bg-amber-500";
    case "meeting":
      return "bg-purple-500";
    case "view":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

function StatCard({ stat }: { stat: StatCard }) {
  const Icon = statIcons[stat.icon as keyof typeof statIcons];

  return (
    <AnimatedCard hoverEffect>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            {stat.trend && (
              <p
                className={cn(
                  "mt-2 text-xs",
                  stat.trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {stat.trend.value}
              </p>
            )}
          </div>
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="text-primary h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = getActivityIcon(activity.type);
  const iconColor = getActivityColor(activity.type);

  return (
    <div className="group hover:bg-muted flex gap-4 rounded-lg p-4 transition-colors">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          iconColor
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{activity.title}</p>
        {activity.description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {activity.description}
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-xs">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: DashboardProperty }) {
  return (
    <AnimatedCard hoverEffect>
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted aspect-video w-full" />
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

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <FadeIn delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">{currentDate}</p>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <FadeIn key={stat.id} delay={0.2 + index * 0.1}>
            <StatCard stat={stat} />
          </FadeIn>
        ))}
      </div>

      {/* Quick Actions */}
      <FadeIn delay={0.6}>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard/search">
              <Search className="mr-2 h-5 w-5" />
              Search Properties
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard/saved-properties">
              <Bookmark className="mr-2 h-5 w-5" />
              View Saved
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard/insights">
              <TrendingUp className="mr-2 h-5 w-5" />
              Market Trends
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity - Left Column (60%) */}
        <div className="lg:col-span-2">
          <FadeIn delay={0.7}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/history">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardActivities.slice(0, 5).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Price Alerts Widget */}
          <FadeIn delay={0.8}>
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Price Alerts</CardTitle>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Bell className="text-primary mt-1 h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium">{alert.propertyTitle}</p>
                        <p className="text-muted-foreground text-sm">
                          Current:{" "}
                          {formatPrice(alert.currentPrice, alert.currency)} →
                          Alert at:{" "}
                          {formatPrice(alert.targetPrice, alert.currency)}
                        </p>
                        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                          ▼ {alert.percentageAway}% away from target
                        </p>
                      </div>
                    </div>
                    {alert.id !== priceAlerts[priceAlerts.length - 1].id && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Upcoming Meetings */}
          <FadeIn delay={0.9}>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1 h-5 w-5" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {meeting.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                          , {meeting.time}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Meet Agent: {meeting.agentName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Property: {meeting.propertyTitle},{" "}
                          {meeting.propertyLocation}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </div>
                    {meeting.id !==
                      upcomingMeetings[upcomingMeetings.length - 1].id && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Recommended Properties - Right Column (40%) */}
        <div>
          <FadeIn delay={0.7}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recommended For You</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/search">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
