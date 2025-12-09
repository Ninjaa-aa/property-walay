import { formatTimestamp, getActivityColor } from "@/lib/utils/dashboard";
import { cn } from "@/lib/utils";
import {
  Save,
  TrendingDown,
  Sparkles,
  Calendar,
  ExternalLink,
  Bell,
  Presentation,
} from "lucide-react";
import type { Activity } from "@/types/dashboard";
import type { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

const activityIcons: Record<Activity["type"], LucideIcon> = {
  save: Save,
  price_change: TrendingDown,
  new_matches: Sparkles,
  meeting: Calendar,
  view: ExternalLink,
  ppt_export: Presentation,
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type] || Bell;
  const iconColor = getActivityColor(activity.type);

  return (
    <div className="group hover:bg-muted flex gap-4 rounded-lg p-4 transition-colors">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          iconColor
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{activity.title}</p>
        {activity.description && (
          <p className="text-muted-foreground mt-1 text-sm">
            {activity.description}
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-xs">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}
