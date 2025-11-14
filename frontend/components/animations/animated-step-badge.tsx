"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedStepBadgeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function AnimatedStepBadgeComponent({
  children,
  delay = 0,
  className = "",
}: AnimatedStepBadgeProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className={`bg-primary text-primary-foreground absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay,
      }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: 5 }}
    >
      {children}
    </motion.div>
  );
}

export const AnimatedStepBadge = memo(AnimatedStepBadgeComponent);
