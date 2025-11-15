/**
 * Format Pakistani currency (PKR) prices
 * Converts numbers to Lac/Crore format
 */

export function formatPrice(price: number, currency: string = "PKR"): string {
  if (!price || price === 0) return "Price on request";

  // Format USD normally
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Format PKR with Lac/Crore
  const crore = 10000000; // 1 Crore = 10 Million
  const lac = 100000; // 1 Lac = 100 Thousand

  if (price >= crore) {
    const crores = price / crore;
    // Show decimals only if less than whole number
    if (crores % 1 === 0) {
      return `PKR ${crores.toFixed(0)} Cr`;
    }
    return `PKR ${crores.toFixed(2)} Cr`;
  } else if (price >= lac) {
    const lacs = price / lac;
    // Show decimals only if less than whole number
    if (lacs % 1 === 0) {
      return `PKR ${lacs.toFixed(0)} Lac`;
    }
    return `PKR ${lacs.toFixed(2)} Lac`;
  } else {
    // For amounts less than 1 Lac, show with commas
    return `PKR ${new Intl.NumberFormat("en-PK").format(price)}`;
  }
}

/**
 * Format price for display in cards (shorter format)
 */
export function formatPriceShort(
  price: number,
  currency: string = "PKR"
): string {
  if (!price || price === 0) return "On request";

  if (currency === "USD") {
    return `$${new Intl.NumberFormat("en-US").format(price)}`;
  }

  const crore = 10000000;
  const lac = 100000;

  if (price >= crore) {
    const crores = price / crore;
    return `${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Cr`;
  } else if (price >= lac) {
    const lacs = price / lac;
    return `${lacs.toFixed(lacs % 1 === 0 ? 0 : 2)} Lac`;
  } else {
    return `${new Intl.NumberFormat("en-PK").format(price)}`;
  }
}

/**
 * Format price with full words (e.g., "1.25 Crore" instead of "1.25 Cr")
 */
export function formatPriceFull(
  price: number,
  currency: string = "PKR"
): string {
  if (!price || price === 0) return "Price on request";

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  const crore = 10000000;
  const lac = 100000;

  if (price >= crore) {
    const crores = price / crore;
    const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2);
    return `PKR ${formatted} Crore`;
  } else if (price >= lac) {
    const lacs = price / lac;
    const formatted = lacs % 1 === 0 ? lacs.toFixed(0) : lacs.toFixed(2);
    return `PKR ${formatted} Lakh`;
  } else {
    return `PKR ${new Intl.NumberFormat("en-PK").format(price)}`;
  }
}
