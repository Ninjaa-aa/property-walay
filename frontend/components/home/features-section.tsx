"use client";

import { Card } from "@/components/ui/card";
import { features } from "@/data/home/features";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
  AnimatedGradientText,
  AnimatedIconContainer,
} from "@/components/animations";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation
          direction="fade"
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features for{" "}
            <AnimatedGradientText as="span">
              Smart Property Search
            </AnimatedGradientText>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Everything you need to find, compare, and invest in properties
            across Pakistan. Powered by cutting-edge AI technology.
          </p>
        </ScrollAnimation>

        <StaggerContainer
          className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {features.map((feature) => {
            return (
              <StaggerItem key={feature.title} direction="up">
                <div className="transition-all duration-300 hover:-translate-y-2">
                  <Card className="bg-card hover:border-primary/50 group relative h-full overflow-hidden border p-6 transition-all duration-300 hover:shadow-lg">
                    <AnimatedIconContainer icon={feature.icon} />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
