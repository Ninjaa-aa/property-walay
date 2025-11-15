import type { PriceAlert } from "@/types/dashboard/price-alert";

export const priceAlerts: PriceAlert[] = [
  {
    id: "alert-1",
    propertyTitle: "Plot in Bahria Town Karachi",
    currentPrice: 8500000,
    targetPrice: 8000000,
    percentageAway: 3,
    currency: "PKR",
  },
  {
    id: "alert-2",
    propertyTitle: "Apartment in Gulberg, Lahore",
    currentPrice: 15000000,
    targetPrice: 14000000,
    percentageAway: 7,
    currency: "PKR",
  },
  {
    id: "alert-3",
    propertyTitle: "House in F-11, Islamabad",
    currentPrice: 32000000,
    targetPrice: 30000000,
    percentageAway: 6,
    currency: "PKR",
  },
];

