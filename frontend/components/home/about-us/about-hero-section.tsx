"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import { ScrollAnimation } from "@/components/home/animations";

export function AboutHeroSection() {
  return (
    <section className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative overflow-hidden bg-linear-to-br py-20 sm:py-28 lg:py-32">
      {/* Animated Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="bg-primary/20 dark:bg-primary/10 absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/20 dark:bg-secondary/10 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollAnimation direction="fade" className="space-y-8 text-center">
            {/* Professional Badge */}
            <motion.div
              className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Building2 className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">
                Leading Real Estate Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <motion.span
                  className="from-primary via-primary/80 to-secondary bg-linear-to-r bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  About Property Walay
                </motion.span>
              </h1>

              {/* Professional Subtitle */}
              <motion.div
                className="mx-auto max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-muted-foreground text-lg leading-relaxed font-medium sm:text-xl md:text-2xl">
                  Revolutionizing Property Search Across Pakistan
                </p>
              </motion.div>
            </div>

            {/* Professional Description */}
            <motion.div
              className="mx-auto max-w-3xl space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="border-border bg-border mx-auto h-px w-24" />
              <p className="text-muted-foreground text-base leading-relaxed sm:text-lg md:text-xl">
                We&apos;re on a mission to transform how Pakistan discovers and
                invests in properties. Powered by cutting-edge AI technology,
                driven by innovation, and dedicated to making property search
                simple, intelligent, and accessible for everyone—from first-time
                buyers to seasoned investors.
              </p>
            </motion.div>

            {/* Key Highlights */}
            <motion.div
              className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                "AI-Powered Search",
                "Real-time Aggregation",
                "Verified Listings",
              ].map((highlight, index) => (
                <motion.div
                  key={highlight}
                  className="bg-card border-border flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Sparkles className="text-primary h-4 w-4" />
                  <span>{highlight}</span>
                </motion.div>
              ))}
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
