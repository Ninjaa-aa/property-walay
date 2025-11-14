"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
  AnimatedBackground,
  AnimatedGradientText,
  AnimatedIcon,
  AnimatedButtonWrapper,
  FadeIn,
  ScaleIn,
} from "@/components/animations";

export function NotFoundContent() {
  return (
    <div className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden bg-linear-to-br py-24 sm:py-32">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Number */}
          <FadeIn delay={0} direction="down" className="mb-8">
            <h1 className="text-8xl font-bold tracking-tight sm:text-9xl md:text-[12rem]">
              <AnimatedGradientText as="span">404</AnimatedGradientText>
            </h1>
          </FadeIn>

          {/* Error Icon */}
          <ScaleIn delay={0.2} className="mb-6 flex justify-center">
            <AnimatedIcon icon={HelpCircle} size="lg" rotate />
          </ScaleIn>

          {/* Error Message */}
          <FadeIn delay={0.3} direction="up" className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed sm:text-xl">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has
              been moved. Let&apos;s get you back on track.
            </p>
          </FadeIn>

          {/* Action Cards */}
          <FadeIn delay={0.4} direction="up" className="mb-8">
            <Card className="bg-card border-border p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    What would you like to do?
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AnimatedButtonWrapper>
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/">
                        <Home className="mr-2 h-5 w-5" />
                        Go Home
                      </Link>
                    </Button>
                  </AnimatedButtonWrapper>
                  <AnimatedButtonWrapper>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/dashboard">
                        <Search className="mr-2 h-5 w-5" />
                        Search Properties
                      </Link>
                    </Button>
                  </AnimatedButtonWrapper>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn
            delay={0.5}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild variant="ghost" size="sm">
              <Link href="/about">
                <ArrowLeft className="mr-2 h-4 w-4" />
                About Us
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/#features">Features</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/#how-it-works">How It Works</Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
