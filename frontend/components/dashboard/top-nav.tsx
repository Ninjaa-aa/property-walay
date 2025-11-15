"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { SearchBar } from "@/components/dashboard/search-bar";

interface TopNavProps {
  className?: string;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/search": "Search Properties",
  "/dashboard/saved-properties": "Saved Properties",
  "/dashboard/history": "Search History",
  "/dashboard/insights": "Investment Insights",
  "/dashboard/meetings": "Meetings",
  "/dashboard/settings": "Settings",
};

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications] = useState(3);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";
  const userInitials =
    user?.email?.split("@")[0].substring(0, 2).toUpperCase() || "U";
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  if (loading) {
    return null;
  }

  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-30 grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-4 lg:px-6",
        className
      )}
    >
      {/* Page Title - Left */}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold lg:text-xl">{pageTitle}</h2>
      </div>

      {/* Search Bar - Center */}
      <div className="hidden md:flex">
        <SearchBar />
      </div>

      {/* Right Section - Right */}
      <div className="flex items-center justify-end gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-1 right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadNotifications}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-auto gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium lg:inline-block">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">{userName}</p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
