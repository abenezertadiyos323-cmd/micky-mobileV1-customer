import { ActivityList } from "@/components/inbox/ActivityList";
import { useRecentActivity } from "@/hooks/useActivity";
import { useAdmin } from "@/contexts/AdminContext";
import type { Activity } from "@/types/admin";

export function InboxTab() {
  const { setActiveTab } = useAdmin();
  const { data: activities, isLoading } = useRecentActivity(50);

  const handleActivityClick = (activity: Activity) => {
    // Navigate to relevant tab based on activity type
    if (activity.type === "phone_action" || activity.type === "exchange_request") {
      setActiveTab("orders");
    }
    // For search type, could navigate to inventory or just show toast
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Activity Count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <span className="text-sm text-muted-foreground">
            {activities.length} {activities.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* Activity List */}
      <ActivityList
        activities={activities}
        isLoading={isLoading}
        onActivityClick={handleActivityClick}
      />
    </div>
  );
}
