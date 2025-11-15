export interface DashboardProperty {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  currency: "PKR" | "USD";
  propertyType: "house" | "apartment" | "plot" | "commercial";
  beds?: number;
  baths?: number;
  size?: number;
  sizeUnit?: "marla" | "kanal" | "sqft";
  image: string;
  savedAt?: Date;
  priceChanged?: {
    percentage: number;
    isDecrease: boolean;
  };
}
