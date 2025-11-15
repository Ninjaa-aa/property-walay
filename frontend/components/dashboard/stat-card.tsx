import { AnimatedCard } from "@/components/animations";
import { CardContent } from "@/components/ui/card";
import { statIcons } from "@/data/dashboard/stats";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/dashboard";

interface StatCardProps {
  stat: StatCard;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = statIcons[stat.icon as keyof typeof statIcons];

  return (
    <AnimatedCard hoverEffect>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            {stat.trend && (
              <p
                className={cn(
                  "mt-2 text-xs",
                  stat.trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {stat.trend.value}
              </p>
            )}
          </div>
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="text-primary h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
