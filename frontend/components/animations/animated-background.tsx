"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedBackgroundProps {
  className?: string;
}

function AnimatedBackgroundComponent({ className }: AnimatedBackgroundProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
      >
        <div className="bg-primary/20 dark:bg-primary/10 absolute top-20 left-10 h-72 w-72 rounded-full blur-2xl" />
        <div className="bg-secondary/20 dark:bg-secondary/10 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-2xl" />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      <motion.div
        className="bg-primary/20 dark:bg-primary/10 absolute top-20 left-10 h-72 w-72 rounded-full blur-2xl"
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
        style={{ willChange: "transform" }}
      />
      <motion.div
        className="bg-secondary/20 dark:bg-secondary/10 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-2xl"
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
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

export const AnimatedBackground = memo(AnimatedBackgroundComponent);
