"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  createDirectionVariants,
  type AnimationDirection,
} from "./animation-variants";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: AnimationDirection;
  duration?: number;
}

const directionVariants = createDirectionVariants(50);

export function ScrollAnimation({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
}: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={directionVariants[direction]}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
