export interface PriceAlert {
  id: string;
  propertyTitle: string;
  currentPrice: number;
  targetPrice: number;
  percentageAway: number;
  currency: "PKR" | "USD";
}
