"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedBadgeProps {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  delay?: number;
}

function AnimatedBadgeComponent({
  icon: Icon,
  children,
  className = "",
  delay = 0,
}: AnimatedBadgeProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      className={`bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30 inline-flex items-center gap-2 rounded-full border px-4 py-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: [0, 10, -10, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }
        }
        style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
      >
        <Icon className="h-4 w-4" />
      </motion.div>
      <span className="text-sm font-medium">{children}</span>
    </motion.div>
  );
}

export const AnimatedBadge = memo(AnimatedBadgeComponent);
