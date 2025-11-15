import type { DashboardNavigationItem } from "@/types/dashboard/navigation";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  History,
  TrendingUp,
  Calendar,
  Settings,
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

