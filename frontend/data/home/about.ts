import type { AboutStat, AboutMission } from "@/types/home/about";
import { Lightbulb, Users, Shield, Globe } from "lucide-react";

export const aboutMission: AboutMission = {
  title: "Our Mission",
  description:
    "To revolutionize property search in Pakistan by making it accessible, intelligent, and efficient for everyone. We believe finding your dream property shouldn't be a frustrating experience.",
  values: [
    {
      title: "Innovation",
      description:
        "Leveraging cutting-edge AI technology to provide smarter property recommendations and search experiences.",
      icon: Lightbulb,
    },
    {
      title: "Transparency",
      description:
        "Providing verified listings with accurate information, ensuring you make informed decisions.",
      icon: Shield,
    },
    {
      title: "Accessibility",
      description:
        "Breaking language barriers and making property search available to everyone, regardless of location or language.",
      icon: Globe,
    },
    {
      title: "User-Centric",
      description:
        "Putting our users first, continuously improving based on feedback to deliver the best possible experience.",
      icon: Users,
    },
  ],
};

export const aboutStats: AboutStat[] = [
  {
    label: "Properties Aggregated",
    value: "50K+",
    description: "From major Pakistani platforms",
  },
  {
    label: "Active Users",
    value: "10K+",
    description: "Finding their dream properties",
  },
  {
    label: "Cities Covered",
    value: "15+",
    description: "Across Pakistan",
  },
  {
    label: "Success Rate",
    value: "95%",
    description: "User satisfaction",
  },
];

export const aboutVision = {
  title: "Our Vision",
  description:
    "To become Pakistan's most trusted and comprehensive property search platform, connecting millions of property seekers with their perfect homes while empowering real estate professionals with powerful tools.",
};
