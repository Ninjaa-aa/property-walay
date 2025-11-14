"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
  rotate?: boolean;
  scale?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-12 w-12 sm:h-16 sm:w-16",
};

function AnimatedIconComponent({
  icon: Icon,
  className = "",
  size = "md",
  rotate = false,
  scale = false,
}: AnimatedIconProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className={`bg-primary/10 text-primary rounded-full p-4 ${className}`}
      animate={
        shouldReduceMotion
          ? undefined
          : rotate
            ? {
                rotate: [0, 10, -10, 0],
              }
            : scale
              ? {
                  scale: [1, 1.1, 1],
                }
              : undefined
      }
      transition={
        shouldReduceMotion
          ? undefined
          : rotate
            ? {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }
            : scale
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : undefined
      }
      whileHover={
        !rotate && !scale && !shouldReduceMotion
          ? { scale: 1.1, rotate: 5 }
          : undefined
      }
    >
      <Icon className={sizeClasses[size]} />
    </motion.div>
  );
}

export const AnimatedIcon = memo(AnimatedIconComponent);
