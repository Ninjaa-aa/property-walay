import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      {/* Additional theme toggle on home page */}
      <div className="fixed right-4 bottom-4 z-50 md:hidden">
        <ThemeToggle />
      </div>
    </>
  );
}
