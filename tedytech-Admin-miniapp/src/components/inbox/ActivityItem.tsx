import { cn, formatRelativeTime } from "@/lib/utils";
import type { Activity } from "@/types/admin";
import { Search, ShoppingCart, Repeat } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
  onClick?: () => void;
  className?: string;
}

export function ActivityItem({ activity, onClick, className }: ActivityItemProps) {
  // Get icon based on activity type
  const getIcon = () => {
    switch (activity.type) {
      case "search":
        return <Search className="h-4 w-4" />;
      case "phone_action":
        return <ShoppingCart className="h-4 w-4" />;
      case "exchange_request":
        return <Repeat className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get icon background color
  const getIconBgClass = () => {
    switch (activity.type) {
      case "search":
        return "bg-blue-500/10 text-blue-400";
      case "phone_action":
        return "bg-green-500/10 text-green-400";
      case "exchange_request":
        return "bg-orange-500/10 text-orange-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50 press-effect",
        className
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={cn("rounded-full p-2 shrink-0", getIconBgClass())}>{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.timestamp)}</p>
      </div>
    </div>
  );
}
