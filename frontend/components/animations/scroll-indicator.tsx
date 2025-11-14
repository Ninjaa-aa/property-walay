"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { FadeIn } from "./fade-in";
import { useSafeReducedMotion } from "./use-safe-reduced-motion";

interface ScrollIndicatorProps {
  delay?: number;
  className?: string;
}

function ScrollIndicatorComponent({
  delay = 1.2,
  className = "",
}: ScrollIndicatorProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <FadeIn delay={delay} direction="down" className={className}>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <motion.div
          className="border-foreground/20 flex h-10 w-6 justify-center rounded-full border-2"
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
        >
          <motion.div
            className="bg-foreground/40 mt-2 h-3 w-1 rounded-full"
            animate={
              shouldReduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ willChange: shouldReduceMotion ? "auto" : "opacity" }}
          />
        </motion.div>
      </div>
    </FadeIn>
  );
}

export const ScrollIndicator = memo(ScrollIndicatorComponent);
