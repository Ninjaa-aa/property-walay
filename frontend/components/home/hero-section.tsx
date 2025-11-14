"use client";

import { Button } from "@/components/ui/button";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-linear-to-br">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/20 dark:bg-primary/10 absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-secondary/20 dark:bg-secondary/10 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Badge */}
          <div className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              AI-Powered Property Search
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="from-primary via-primary/80 to-secondary bg-linear-to-r bg-clip-text text-transparent">
              Find Your Dream Property
            </span>
            <br />
            <span className="text-foreground">in Pakistan</span>
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
            AI-powered real estate platform that aggregates properties from all
            major Pakistani platforms.
            <br className="hidden sm:block" />
            <span className="text-foreground/80">
              Search smarter, find faster, invest better.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full px-8 py-6 text-base sm:w-auto"
            >
              <Link href="/dashboard">
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full px-8 py-6 text-base sm:w-auto"
            >
              <Link href="/about">
                <TrendingUp className="mr-2 h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <div className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium">
              Real-time Aggregation
            </div>
            <div className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium">
              AI Recommendations
            </div>
            <div className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium">
              Multilingual Support
            </div>
            <div className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium">
              Price Alerts
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="border-foreground/20 flex h-10 w-6 justify-center rounded-full border-2">
          <div className="bg-foreground/40 mt-2 h-3 w-1 rounded-full" />
        </div>
      </div>
    </section>
  );
}
