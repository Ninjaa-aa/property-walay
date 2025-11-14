"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { howItWorksSteps } from "@/data/home/how-it-works";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";

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
            <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">
              Property Walay
            </span>{" "}
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
              const Icon = step.icon;
              return (
                <StaggerItem key={step.step} direction="up">
                  <div className="relative">
                    {/* Animated Connector line for desktop */}
                    {index < howItWorksSteps.length - 1 && (
                      <motion.div
                        className="bg-primary/20 hidden h-0.5 w-full translate-x-1/2 translate-y-6 lg:absolute lg:top-12 lg:block"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.15 + 0.3,
                        }}
                      />
                    )}

                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-card hover:border-primary/50 group relative h-full border p-6 transition-all duration-300 hover:shadow-lg">
                        {/* Step number badge */}
                        <motion.div
                          className="bg-primary text-primary-foreground absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg"
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: index * 0.15,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {step.step}
                        </motion.div>

                        <motion.div
                          className="bg-primary/10 text-primary mt-2 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>

                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </Card>
                    </motion.div>
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
            <motion.div
              className="bg-card border-border mx-auto max-w-2xl rounded-2xl border p-8 shadow-lg"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold">
                Ready to Find Your Dream Property?
              </h3>
              <p className="text-muted-foreground mt-4">
                Join thousands of users who are already finding their perfect
                property with Property Walay.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      <Search className="mr-2 h-5 w-5" />
                      Start Searching Now
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
