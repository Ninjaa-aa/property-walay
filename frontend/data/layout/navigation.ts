import type { NavigationItem } from "@/types/layout/navigation";
import { Home, Search, User } from "lucide-react";

export const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Search },
  { name: "Dashboard", href: "/dashboard", icon: User },
];
