"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export function NotFoundContent() {
  return (
    <div className="from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden bg-linear-to-br py-24 sm:py-32">
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
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold tracking-tight sm:text-9xl md:text-[12rem]">
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
                404
              </motion.span>
            </h1>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              className="bg-primary/10 text-primary rounded-full p-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16" />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed sm:text-xl">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has
              been moved. Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-card border-border p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    What would you like to do?
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
