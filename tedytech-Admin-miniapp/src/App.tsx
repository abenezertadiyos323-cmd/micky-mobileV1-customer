import React, { Suspense, useEffect } from "react";
import { initTelegramWebApp } from "./telegramMock";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2 } from "lucide-react";

const DashboardTab = React.lazy(() =>
  import("@/pages/DashboardTab").then((m) => ({ default: m.DashboardTab }))
);
const InventoryTab = React.lazy(() =>
  import("@/pages/InventoryTab").then((m) => ({ default: m.InventoryTab }))
);
const OrdersTab = React.lazy(() =>
  import("@/pages/OrdersTab").then((m) => ({ default: m.OrdersTab }))
);
const InboxTab = React.lazy(() =>
  import("@/pages/InboxTab").then((m) => ({ default: m.InboxTab }))
);

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function App() {
  const { activeTab, isWebAppReady } = useAdmin();

  useEffect(() => {
    // Initialize Telegram WebApp mock for dev mode
    initTelegramWebApp();
  }, []);

  // Show loading screen while Telegram WebApp initializes
  if (!isWebAppReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get screen title based on active tab
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "inventory":
        return "Inventory";
      case "orders":
        return "Orders & Exchanges";
      case "inbox":
        return "Inbox";
      default:
        return "TedyTech Admin";
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "inventory":
        return <InventoryTab />;
      case "orders":
        return <OrdersTab />;
      case "inbox":
        return <InboxTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <AdminLayout title={getTitle()}>
      <Suspense fallback={<TabLoader />}>
        {renderTabContent()}
      </Suspense>
    </AdminLayout>
  );
}
