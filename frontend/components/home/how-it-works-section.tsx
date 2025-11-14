"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { howItWorksSteps } from "@/data/home/how-it-works";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
  AnimatedGradientText,
  AnimatedButtonWrapper,
  AnimatedIconContainer,
  AnimatedStepBadge,
  AnimatedConnector,
} from "@/components/animations";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation
          direction="fade"
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How{" "}
            <AnimatedGradientText as="span">
              Property Walay
            </AnimatedGradientText>{" "}
            Works
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Finding your dream property has never been easier. Follow these
            simple steps to get started.
          </p>
        </ScrollAnimation>

        <div className="mx-auto mt-16 max-w-5xl">
          <StaggerContainer
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.15}
          >
            {howItWorksSteps.map((step, index) => {
              return (
                <StaggerItem key={step.step} direction="up">
                  <div className="relative">
                    {/* Animated Connector line for desktop */}
                    {index < howItWorksSteps.length - 1 && (
                      <AnimatedConnector delay={index * 0.15 + 0.3} />
                    )}

                    <div className="transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]">
                      <Card className="bg-card hover:border-primary/50 group relative h-full border p-6 transition-all duration-300 hover:shadow-lg">
                        {/* Step number badge */}
                        <AnimatedStepBadge delay={index * 0.15}>
                          {step.step}
                        </AnimatedStepBadge>

                        <AnimatedIconContainer icon={step.icon} />

                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </Card>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* CTA Section */}
          <ScrollAnimation
            direction="up"
            delay={0.3}
            className="mt-16 text-center"
          >
            <div className="bg-card border-border mx-auto max-w-2xl rounded-2xl border p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-bold">
                Ready to Find Your Dream Property?
              </h3>
              <p className="text-muted-foreground mt-4">
                Join thousands of users who are already finding their perfect
                property with Property Walay.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <AnimatedButtonWrapper>
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      <Search className="mr-2 h-5 w-5" />
                      Start Searching Now
                    </Link>
                  </Button>
                </AnimatedButtonWrapper>
                <AnimatedButtonWrapper>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </AnimatedButtonWrapper>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
