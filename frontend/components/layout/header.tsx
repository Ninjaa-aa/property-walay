"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { navigationItems } from "@/data/layout/navigation";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 sticky top-0 z-50 w-full bg-linear-to-br">
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3">
        <nav className="border-border/50 bg-background/40 flex h-14 w-full items-center justify-between rounded-full border px-4 backdrop-blur-lg sm:h-16 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Property Walay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden md:flex">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 md:hidden">
          <div className="border-border/50 bg-background/40 rounded-2xl border backdrop-blur-lg">
            <div className="space-y-1 px-4 py-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 border-t pt-4">
                <div onClick={() => setMobileMenuOpen(false)}>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
