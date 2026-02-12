import { HotLeadsSection } from "@/components/dashboard/HotLeadsSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { InventorySummaryCard } from "@/components/dashboard/InventorySummaryCard";
import { OrdersSummaryCard } from "@/components/dashboard/OrdersSummaryCard";
import { OfflineIndicator } from "@/components/dashboard/OfflineIndicator";
import { useHotLeads } from "@/hooks/useHotLeads";
import { useProductStats } from "@/hooks/useProducts";
import { usePhoneActionStats } from "@/hooks/useOrders";
import { useExchangeStats } from "@/hooks/useExchanges";
import { useRecentActivity } from "@/hooks/useActivity";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useAdmin } from "@/contexts/AdminContext";
import { Package, Activity } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Block } from "konsta/react";

export function DashboardTab() {
  const { setActiveTab } = useAdmin();
  const { data: hotLeads, isLoading: hotLeadsLoading } = useHotLeads(10);
  const { data: productStats } = useProductStats();
  const { data: actionStats } = usePhoneActionStats();
  const { data: exchangeStats } = useExchangeStats();
  const { data: activities } = useRecentActivity(5);
  const { isOnline, lastSyncTime } = useNetworkStatus();

  const todayActivity = actionStats.todayActions + exchangeStats.todayExchanges;

  return (
    <div className="pb-20 space-y-4">
      {/* Offline Indicator (Priority 0 - Critical Status) */}
      {!isOnline && <OfflineIndicator />}

      <Block strong>
        {/* 1. HOT LEADS (Priority 1 - Most Important) */}
        <HotLeadsSection leads={hotLeads} isLoading={hotLeadsLoading} />
      </Block>

      <Block strong>
        {/* 2. Orders/Exchanges Summary (Priority 2) */}
        <OrdersSummaryCard
          phoneActions={actionStats.totalActions}
          exchangeRequests={exchangeStats.totalExchanges}
          onViewAll={() => setActiveTab("orders")}
        />
      </Block>

      <Block strong>
        {/* 3. Inventory Summary (Priority 3) */}
        <InventorySummaryCard
          totalProducts={productStats.totalProducts}
          byStatus={{
            active: productStats.activeProducts,
            draft: productStats.draftProducts,
            archived: productStats.archivedProducts,
          }}
          onViewAll={() => setActiveTab("inventory")}
        />
      </Block>

      <Block strong>
        {/* 4. Quick Stats Grid (Priority 4) */}
        <div className="grid grid-cols-2 gap-3 px-0">
          <StatCard
            label="Today's Activity"
            value={todayActivity}
            icon={Activity}
          />
          <StatCard
            label="Active Products"
            value={productStats.activeProducts}
            icon={Package}
          />
        </div>
      </Block>

      <Block strong>
        {/* 5. Recent Activity (Priority 5) */}
        <ActivityCard
          activities={activities}
          maxItems={5}
          onActivityClick={(activity) => {
            if (
              activity.type === "exchange_request" ||
              activity.type === "phone_action"
            ) {
              setActiveTab("orders");
            }
          }}
        />

        {/* Last Sync Time */}
        <p className="text-xs text-gray-400 text-center pb-4 mt-3">
          Updated {formatRelativeTime(lastSyncTime)}
        </p>
      </Block>
    </div>
  );
}
