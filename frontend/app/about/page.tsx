import { AboutHeroSection } from "@/components/home/about-us/about-hero-section";
import { AboutMissionSection } from "@/components/home/about-us/about-mission-section";
import { AboutStatsSection } from "@/components/home/about-us/about-stats-section";
import { AboutCTASection } from "@/components/home/about-us/about-cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Property Walay",
  description:
    "Learn about Property Walay - Pakistan's AI-powered real estate platform. Our mission, vision, and commitment to revolutionizing property search.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutStatsSection />
      <AboutCTASection />
    </>
  );
}
