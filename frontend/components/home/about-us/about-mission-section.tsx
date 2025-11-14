"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { aboutMission, aboutVision } from "@/data/home/about";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";

export function AboutMissionSection() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <ScrollAnimation
          direction="fade"
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {aboutMission.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            {aboutMission.description}
          </p>
        </ScrollAnimation>

        {/* Values Grid */}
        <StaggerContainer
          className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {aboutMission.values.map((value) => {
            const Icon = value.icon;
            return (
              <StaggerItem key={value.title} direction="up">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card hover:border-primary/50 group relative h-full overflow-hidden border p-6 transition-all duration-300 hover:shadow-lg">
                    <motion.div
                      className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Vision */}
        <ScrollAnimation
          direction="fade"
          delay={0.3}
          className="mx-auto mt-24 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {aboutVision.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            {aboutVision.description}
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}

