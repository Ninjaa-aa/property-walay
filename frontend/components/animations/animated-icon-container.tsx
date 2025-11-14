"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedIconContainerProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

function AnimatedIconContainerComponent({
  icon: Icon,
  className = "",
  iconClassName = "h-6 w-6",
}: AnimatedIconContainerProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className={`bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${className}`}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
      style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
    >
      <Icon className={iconClassName} />
    </motion.div>
  );
}

export const AnimatedIconContainer = memo(AnimatedIconContainerComponent);
