export interface StatCard {
  id: string;
  title: string;
  value: number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
}
