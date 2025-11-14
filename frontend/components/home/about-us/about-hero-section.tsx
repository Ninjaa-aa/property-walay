"use client";

import { Building2, Sparkles } from "lucide-react";
import {
  AnimatedBackground,
  AnimatedBadge,
  AnimatedGradientText,
  ScrollAnimation,
  FadeIn,
  ScaleIn,
} from "@/components/animations";

export function AboutHeroSection() {
  return (
    <section className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative overflow-hidden bg-linear-to-br py-20 sm:py-28 lg:py-32">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollAnimation direction="fade" className="space-y-8 text-center">
            {/* Professional Badge */}
            <AnimatedBadge icon={Building2} delay={0}>
              Leading Real Estate Platform
            </AnimatedBadge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <AnimatedGradientText as="span">
                  About Property Walay
                </AnimatedGradientText>
              </h1>

              {/* Professional Subtitle */}
              <FadeIn delay={0.2} direction="up">
                <p className="text-muted-foreground text-lg leading-relaxed font-medium sm:text-xl md:text-2xl">
                  Revolutionizing Property Search Across Pakistan
                </p>
              </FadeIn>
            </div>

            {/* Professional Description */}
            <FadeIn delay={0.3} direction="up">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="border-border bg-border mx-auto h-px w-24" />
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg md:text-xl">
                  We&apos;re on a mission to transform how Pakistan discovers
                  and invests in properties. Powered by cutting-edge AI
                  technology, driven by innovation, and dedicated to making
                  property search simple, intelligent, and accessible for
                  everyone—from first-time buyers to seasoned investors.
                </p>
              </div>
            </FadeIn>

            {/* Key Highlights */}
            <FadeIn delay={0.4} direction="up">
              <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4">
                {[
                  "AI-Powered Search",
                  "Real-time Aggregation",
                  "Verified Listings",
                ].map((highlight, index) => (
                  <ScaleIn
                    key={highlight}
                    delay={0.5 + index * 0.1}
                    duration={0.4}
                    className="bg-card border-border flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:scale-105"
                  >
                    <Sparkles className="text-primary h-4 w-4" />
                    <span>{highlight}</span>
                  </ScaleIn>
                ))}
              </div>
            </FadeIn>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
