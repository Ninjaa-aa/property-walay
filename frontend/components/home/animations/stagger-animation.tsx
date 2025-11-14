"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  createDirectionVariants,
  type AnimationDirection,
} from "./animation-variants";

interface StaggerAnimationProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const directionVariants = createDirectionVariants(30);

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerAnimationProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = "up",
}: {
  children: ReactNode;
  direction?: AnimationDirection;
}) {
  return (
    <motion.div
      variants={{
        hidden: directionVariants[direction],
        visible: {
          y: 0,
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.25, 0, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
