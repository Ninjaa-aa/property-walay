import type { NavigationItem } from "@/types/layout/navigation";
import { Home, Search, Sparkles, PlayCircle } from "lucide-react";

export const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Search },
  { name: "Features", href: "/#features", icon: Sparkles },
  { name: "How It Works", href: "/#how-it-works", icon: PlayCircle },
];
