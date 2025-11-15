"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/animations";
import { dashboardStats } from "@/data/dashboard/stats";
import { dashboardActivities } from "@/data/dashboard/activities";
import { priceAlerts } from "@/data/dashboard/price-alerts";
import { upcomingMeetings } from "@/data/dashboard/meetings";
import { formatPrice } from "@/lib/utils/dashboard";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRecommendedProperties } from "@/hooks/use-properties";
import { apiPropertyToDashboard } from "@/lib/utils/property";
import { StatCard } from "./stat-card";
import { ActivityItem } from "./activity-item";
import { PropertyCard } from "./property-card";
import { Bookmark, Calendar, Bell, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

export function DashboardContent() {
  const { user, profile, loading: userLoading } = useUserProfile();
  const {
    properties: recommendedProps,
    loading: propertiesLoading,
    error: propertiesError,
  } = useRecommendedProperties(3);

  const loading = userLoading || propertiesLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  const firstName =
    profile?.first_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split("@")[0] ||
    "User";
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
            Welcome back, {firstName}! 👋
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
                {propertiesError ? (
                  <div className="text-muted-foreground py-4 text-center text-sm">
                    Failed to load properties. Please try again later.
                  </div>
                ) : recommendedProps.length === 0 ? (
                  <div className="text-muted-foreground py-4 text-center text-sm">
                    No recommended properties available.
                  </div>
                ) : (
                  recommendedProps.map((property) => (
                    <PropertyCard
                      key={property.our_id}
                      property={apiPropertyToDashboard(property)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
