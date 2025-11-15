import type { StatCard } from "@/types/dashboard/stats";
import { Bookmark, History, Bell, Calendar } from "lucide-react";

export const dashboardStats: StatCard[] = [
  {
    id: "saved",
    title: "Saved",
    value: 12,
    label: "Properties",
    trend: {
      value: "+2 this week",
      isPositive: true,
    },
    icon: "Bookmark",
  },
  {
    id: "recent",
    title: "Recent",
    value: 8,
    label: "Searches",
    trend: {
      value: "View all →",
      isPositive: true,
    },
    icon: "History",
  },
  {
    id: "alerts",
    title: "Active",
    value: 3,
    label: "Price Alerts",
    trend: {
      value: "View all →",
      isPositive: true,
    },
    icon: "Bell",
  },
  {
    id: "meetings",
    title: "Upcoming",
    value: 2,
    label: "Meetings",
    trend: {
      value: "View all →",
      isPositive: true,
    },
    icon: "Calendar",
  },
];

export const statIcons = {
  Bookmark,
  History,
  Bell,
  Calendar,
};

