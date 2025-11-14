"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
}

function AnimatedButtonWrapperComponent({
  children,
  className = "",
}: AnimatedButtonProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const AnimatedButtonWrapper = memo(AnimatedButtonWrapperComponent);
