"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-linear-to-br">
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
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Badge */}
          <motion.div
            className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span className="text-sm font-medium">
              AI-Powered Property Search
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
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
              Find Your Dream Property
            </motion.span>
            <br />
            <motion.span
              className="text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              in Pakistan
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            AI-powered real estate platform that aggregates properties from all
            major Pakistani platforms.
            <br className="hidden sm:block" />
            <span className="text-foreground/80">
              Search smarter, find faster, invest better.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
          </motion.div>

          {/* Key Features Pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              "Real-time Aggregation",
              "AI Recommendations",
              "Multilingual Support",
              "Price Alerts",
            ].map((text, index) => (
              <motion.div
                key={text}
                className="bg-card border-border rounded-full border px-4 py-2 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 1 + index * 0.1,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          className="border-foreground/20 flex h-10 w-6 justify-center rounded-full border-2"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="bg-foreground/40 mt-2 h-3 w-1 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
