/**
 * Format area size with unit
 */

export function formatArea(
  size: number | null | undefined,
  unit: string | null | undefined
): string {
  if (!size) return "N/A";

  const unitStr = unit ? ` ${unit}` : "";
  return `${new Intl.NumberFormat("en-PK").format(size)}${unitStr}`;
}

/**
 * Format area for display in cards (compact)
 */
export function formatAreaShort(
  size: number | null | undefined,
  unit: string | null | undefined
): string {
  if (!size) return "N/A";

  const unitStr = unit ? ` ${unit}` : "";
  // Don't add commas for small numbers
  if (size < 1000) {
    return `${size}${unitStr}`;
  }
  return `${new Intl.NumberFormat("en-PK").format(size)}${unitStr}`;
}
