import { Card } from "@/components/ui/card";
import { aboutStats } from "@/data/home/about";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
  AnimatedGradientText,
} from "@/components/animations";

export function AboutStatsSection() {
  return (
    <section className="bg-muted/30 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation
          direction="fade"
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            By The{" "}
            <AnimatedGradientText as="span">Numbers</AnimatedGradientText>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Our impact in transforming property search across Pakistan
          </p>
        </ScrollAnimation>

        <StaggerContainer
          className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {aboutStats.map((stat) => (
            <StaggerItem key={stat.label} direction="up">
              <div className="transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]">
                <Card className="bg-card hover:border-primary/50 group relative h-full border p-8 text-center transition-all duration-300 hover:shadow-lg">
                  <AnimatedGradientText
                    as="div"
                    className="text-4xl font-bold sm:text-5xl"
                  >
                    {stat.value}
                  </AnimatedGradientText>
                  <h3 className="text-foreground mt-4 text-lg font-semibold">
                    {stat.label}
                  </h3>
                  {stat.description && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      {stat.description}
                    </p>
                  )}
                </Card>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
