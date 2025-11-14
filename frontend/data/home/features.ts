import type { Feature } from "@/types/home/feature";
import {
  Search,
  Sparkles,
  Globe,
  Bell,
  Zap,
  Shield,
  BarChart3,
  MapPin,
} from "lucide-react";

export const features: Feature[] = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Intelligent search engine that understands natural language queries and finds the perfect property match for you.",
  },
  {
    icon: Sparkles,
    title: "Real-time Aggregation",
    description:
      "Automatically collects and updates property listings from all major Pakistani real estate platforms in real-time.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Search and browse properties in English, Urdu, and other regional languages for a seamless experience.",
  },
  {
    icon: Bell,
    title: "Price Alerts",
    description:
      "Get instant notifications when properties matching your criteria become available or prices drop.",
  },
  {
    icon: Zap,
    title: "AI Recommendations",
    description:
      "Personalized property recommendations based on your search history, preferences, and budget.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "All properties are verified for authenticity to ensure you only see legitimate listings.",
  },
  {
    icon: BarChart3,
    title: "Market Insights",
    description:
      "Access comprehensive market analytics, price trends, and neighborhood statistics to make informed decisions.",
  },
  {
    icon: MapPin,
    title: "Location Intelligence",
    description:
      "Advanced location-based search with proximity to schools, hospitals, and amenities highlighted.",
  },
];
