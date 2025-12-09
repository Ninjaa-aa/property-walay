import type { DashboardNavigationItem } from "@/types/dashboard/navigation";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  History,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
} from "lucide-react";

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Search Properties",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    name: "Market Trends",
    href: "/dashboard/trends",
    icon: BarChart3,
  },
  {
    name: "Saved Properties",
    href: "/dashboard/saved-properties",
    icon: Bookmark,
  },
  {
    name: "Search History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Investment Insights",
    href: "/dashboard/insights",
    icon: TrendingUp,
  },
  {
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: Calendar,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

