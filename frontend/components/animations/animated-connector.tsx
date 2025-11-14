"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface AnimatedConnectorProps {
  delay?: number;
  className?: string;
}

function AnimatedConnectorComponent({
  delay = 0,
  className = "",
}: AnimatedConnectorProps) {
  return (
    <motion.div
      className={`bg-primary/20 hidden h-0.5 w-full translate-x-1/2 translate-y-6 lg:absolute lg:top-12 lg:block ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
      }}
    />
  );
}

export const AnimatedConnector = memo(AnimatedConnectorComponent);
