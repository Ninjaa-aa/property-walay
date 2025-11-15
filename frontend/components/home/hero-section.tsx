"use client";

import { Button } from "@/components/ui/button";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  AnimatedBackground,
  AnimatedBadge,
  AnimatedGradientText,
  AnimatedButtonWrapper,
  FadeIn,
  ScaleIn,
  ScrollIndicator,
} from "@/components/animations";

export function HeroSection() {
  return (
    <section className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative flex min-h-screen items-start justify-center overflow-hidden bg-linear-to-br">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Badge */}
          <AnimatedBadge icon={Sparkles} delay={0.2}>
            AI-Powered Property Search
          </AnimatedBadge>

          {/* Main Heading */}
          <FadeIn delay={0.3} duration={0.8} direction="up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <AnimatedGradientText as="span">
                Find Your Dream Property
              </AnimatedGradientText>
              <br />
              <span className="text-foreground">in Pakistan</span>
            </h1>
          </FadeIn>

          {/* Subheading */}
          <FadeIn delay={0.5} duration={0.8} direction="up">
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              AI-powered real estate platform that aggregates properties from
              all major Pakistani platforms.
              <br className="hidden sm:block" />
              <span className="text-foreground/80">
                Search smarter, find faster, invest better.
              </span>
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.7} duration={0.8} direction="up">
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <AnimatedButtonWrapper>
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
              </AnimatedButtonWrapper>
              <AnimatedButtonWrapper>
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
              </AnimatedButtonWrapper>
            </div>
          </FadeIn>

          {/* Key Features Pills */}
          <FadeIn delay={0.9} duration={0.8}>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
              {[
                "Real-time Aggregation",
                "AI Recommendations",
                "Multilingual Support",
                "Price Alerts",
              ].map((text, index) => (
                <ScaleIn
                  key={text}
                  delay={1 + index * 0.1}
                  duration={0.4}
                  className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:scale-105"
                >
                  {text}
                </ScaleIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator delay={1.2} />
    </section>
  );
}
