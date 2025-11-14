import type { HowItWorksStep } from "@/types/home/how-it-works";
import { Search, Filter, Sparkles, CheckCircle2 } from "lucide-react";

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    icon: Search,
    title: "Search Properties",
    description:
      "Enter your preferences - location, budget, property type, and features. Our AI understands natural language, so you can search just like you talk.",
  },
  {
    step: "02",
    icon: Filter,
    title: "AI Aggregates Results",
    description:
      "Our intelligent system searches across all major Pakistani real estate platforms simultaneously, aggregating thousands of listings in seconds.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Get Smart Recommendations",
    description:
      "AI analyzes your preferences and browsing history to suggest the best matches. See personalized recommendations ranked by relevance to you.",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Connect & Invest",
    description:
      "Review verified listings, compare prices, and connect directly with property owners or agents. Set up price alerts for future opportunities.",
  },
];
