import { Activity } from "@/types/admin";
import { formatRelativeTime } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  RefreshCw,
  Activity as ActivityIcon,
} from "lucide-react";
import { List, ListItem, Block } from "konsta/react";

interface ActivityCardProps {
  activities: Activity[];
  maxItems?: number;
  onActivityClick?: (activity: Activity) => void;
}

export function ActivityCard({
  activities,
  maxItems = 5,
  onActivityClick,
}: ActivityCardProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getIcon = (type: string) => {
    switch (type) {
      case "search":
        return Search;
      case "phone_action":
        return ShoppingCart;
      case "exchange_request":
        return RefreshCw;
      default:
        return ActivityIcon;
    }
  };

  return (
    <div className="space-y-2 px-4">
      <h3 className="font-semibold text-base">Recent Activity</h3>
      {displayActivities.length === 0 ? (
        <Block className="p-4 text-center">No recent activity</Block>
      ) : (
        <List dividers>
          {displayActivities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <ListItem
                key={`${activity.type}-${activity.timestamp}`}
                link
                linkComponent="button"
                media={<Icon className="h-5 w-5 text-gray-400" />}
                title={
                  <span className="text-sm text-gray-900">
                    {activity.description}
                  </span>
                }
                subtitle={formatRelativeTime(activity.timestamp)}
                linkProps={{ onClick: () => onActivityClick?.(activity) }}
              />
            );
          })}
        </List>
      )}
    </div>
  );
}
