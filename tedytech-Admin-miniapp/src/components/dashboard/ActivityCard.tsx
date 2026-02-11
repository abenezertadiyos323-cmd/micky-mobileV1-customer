import { Activity } from '@/types/admin';
import { formatRelativeTime } from '@/lib/utils';
import { Search, ShoppingCart, RefreshCw, Activity as ActivityIcon } from 'lucide-react';

interface ActivityCardProps {
  activities: Activity[];
  maxItems?: number;
  onActivityClick?: (activity: Activity) => void;
}

export function ActivityCard({ activities, maxItems = 5, onActivityClick }: ActivityCardProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getIcon = (type: string) => {
    switch (type) {
      case 'search': return Search;
      case 'phone_action': return ShoppingCart;
      case 'exchange_request': return RefreshCw;
      default: return ActivityIcon;
    }
  };

  return (
    <div className="space-y-2 px-4">
      <h3 className="font-semibold text-base">Recent Activity</h3>
      {displayActivities.length === 0 ? (
        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center text-gray-500">
          No recent activity
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {displayActivities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            return (
              <div
                key={`${activity.type}-${activity.timestamp}-${index}`}
                onClick={() => onActivityClick?.(activity)}
                className={`p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition ${
                  index !== displayActivities.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
