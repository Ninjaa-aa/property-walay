"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

function AnimatedCardComponent({
  children,
  className = "",
  hoverEffect = true,
  delay = 0,
}: AnimatedCardProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={
        hoverEffect && !shouldReduceMotion ? { y: -8, scale: 1.02 } : undefined
      }
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  );
}

export const AnimatedCard = memo(AnimatedCardComponent);
