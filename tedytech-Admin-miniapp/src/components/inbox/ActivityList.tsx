import { ActivityItem } from "@/components/inbox/ActivityItem";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types/admin";
import { Loader2, Bell } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
  onActivityClick?: (activity: Activity) => void;
  className?: string;
}

export function ActivityList({ activities, isLoading = false, onActivityClick, className }: ActivityListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-semibold">No activity yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Recent customer actions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onClick={() => onActivityClick?.(activity)}
        />
      ))}
    </div>
  );
}
