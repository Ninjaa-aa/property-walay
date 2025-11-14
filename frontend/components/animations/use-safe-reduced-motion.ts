"use client";

import { useSyncExternalStore } from "react";

/**
 * Safely use reduced motion preference, handling SSR gracefully.
 * Returns false during SSR to prevent hydration mismatches and module loading errors.
 *
 * This hook checks the user's reduced motion preference using the CSS media query,
 * avoiding framer-motion's useReducedMotion hook which causes SSR issues.
 */
function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }
  // Fallback for older browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }

  return () => {};
}

export function useSafeReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false // Server snapshot (always false for SSR)
  );
}
