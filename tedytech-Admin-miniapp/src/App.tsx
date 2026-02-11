import React, { Suspense, useEffect, useState } from "react";
import { initTelegramWebApp } from "./telegramMock";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2 } from "lucide-react";

const DashboardTab = React.lazy(() =>
  import("@/pages/DashboardTab").then((m) => ({ default: m.DashboardTab })),
);
const InventoryTab = React.lazy(() =>
  import("@/pages/InventoryTab").then((m) => ({ default: m.InventoryTab })),
);
const OrdersTab = React.lazy(() =>
  import("@/pages/OrdersTab").then((m) => ({ default: m.OrdersTab })),
);
const InboxTab = React.lazy(() =>
  import("@/pages/InboxTab").then((m) => ({ default: m.InboxTab })),
);

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function App() {
  const { activeTab, isWebAppReady, webAppError, isAuthorized } = useAdmin();
  const [initTimedOut, setInitTimedOut] = useState(false);

  useEffect(() => {
    console.log("[AdminApp] App mounted. Initializing Telegram bridge.");
    initTelegramWebApp();
  }, []);

  useEffect(() => {
    console.log("[AdminApp] Active tab changed", { activeTab });
  }, [activeTab]);

  useEffect(() => {
    if (isWebAppReady) {
      setInitTimedOut(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      console.error("[AdminApp] App remained in loading state for 5 seconds");
      setInitTimedOut(true);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [isWebAppReady]);

  if (!isWebAppReady) {
    if (initTimedOut) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 space-y-3 text-center shadow-sm">
            <h1 className="text-lg font-semibold">Initialization Failed</h1>
            <p className="text-sm text-muted-foreground">
              The app could not finish Telegram startup. Please reopen the mini
              app in Telegram.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authorization explicitly failed, show Unauthorized screen
  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6 rounded-lg shadow bg-card">
          <h2 className="text-lg font-semibold mb-2">Unauthorized Access</h2>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // If authorization is pending, show loader
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      {webAppError ? (
        <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {webAppError}
        </div>
      ) : null}
      <Suspense fallback={<TabLoader />}>{renderTabContent()}</Suspense>
    </AdminLayout>
  );
}
