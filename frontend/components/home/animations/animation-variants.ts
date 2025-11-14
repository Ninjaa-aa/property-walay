/**
 * Shared animation variants for consistent animations across components
 */

export type AnimationDirection = "up" | "down" | "left" | "right" | "fade";

/**
 * Creates direction variants for animations
 * @param offset - The offset distance for the animation (default: 30)
 */
export function createDirectionVariants(offset: number = 30) {
  return {
    up: { y: offset, opacity: 0 },
    down: { y: -offset, opacity: 0 },
    left: { x: offset, opacity: 0 },
    right: { x: -offset, opacity: 0 },
    fade: { opacity: 0 },
  } as const;
}
