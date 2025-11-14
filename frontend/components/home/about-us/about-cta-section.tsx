import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  ScrollAnimation,
  AnimatedButtonWrapper,
} from "@/components/animations";

export function AboutCTASection() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation
          direction="up"
          delay={0.2}
          className="mx-auto max-w-4xl"
        >
          <Card className="bg-card border-border relative overflow-hidden border p-8 shadow-lg sm:p-12">
            <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br opacity-50" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Join thousands of users who are already finding their perfect
                property with Property Walay. Start your search today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <AnimatedButtonWrapper>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/dashboard">
                      <Search className="mr-2 h-5 w-5" />
                      Start Searching
                    </Link>
                  </Button>
                </AnimatedButtonWrapper>
                <AnimatedButtonWrapper>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/#features">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </AnimatedButtonWrapper>
              </div>
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </section>
  );
}
