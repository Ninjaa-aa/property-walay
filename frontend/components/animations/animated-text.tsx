"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}

function AnimatedGradientTextComponent({
  children,
  className = "",
  as = "span",
}: AnimatedTextProps) {
  const shouldReduceMotion = useSafeReducedMotion();
  const MotionComponent = motion[as] as typeof motion.span;

  return (
    <MotionComponent
      className={`from-primary via-primary/80 to-secondary bg-linear-to-r bg-clip-text text-transparent ${className}`}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              backgroundPosition: ["0%", "100%", "0%"],
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }
      }
      style={{
        backgroundSize: "200% 200%",
        willChange: shouldReduceMotion ? "auto" : "background-position",
      }}
    >
      {children}
    </MotionComponent>
  );
}

export const AnimatedGradientText = memo(AnimatedGradientTextComponent);
