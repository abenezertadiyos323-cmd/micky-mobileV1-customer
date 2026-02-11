import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useConvex } from 'convex/react';
import type { TabType, Filters } from "@/types/admin";
import { processQueue } from '@/lib/offlineQueue';
import { toast } from '@/lib/toast';

interface AdminContextType {
  // Active tab navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Session & auth
  sessionId: string | null;
  telegramUserId: number | null;
  isWebAppReady: boolean;

  // Inventory filters
  inventoryFilters: Filters;
  setInventoryFilters: (filters: Filters) => void;
  clearInventoryFilters: () => void;

  // Orders filters
  ordersFilters: Filters;
  setOrdersFilters: (filters: Filters) => void;
  clearOrdersFilters: () => void;

  // UI state
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [telegramUserId, setTelegramUserId] = useState<number | null>(null);
  const [isWebAppReady, setIsWebAppReady] = useState(false);

  // Filter states
  const [inventoryFilters, setInventoryFilters] = useState<Filters>({});
  const [ordersFilters, setOrdersFilters] = useState<Filters>({});

  // UI state
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Initialize Telegram WebApp
  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // Signal ready
        tg.ready?.();

        // Expand to full height
        tg.expand?.();

        // Apply Telegram colorScheme — dark by default, switch to light if Telegram says so
        const root = document.documentElement;
        if ((tg as any).colorScheme === "light") {
          root.classList.remove("dark");
        }

        // Apply theme colors to CSS variables if available
        if (tg.themeParams) {
          if (tg.themeParams.bg_color) {
            root.style.setProperty("--tg-bg-color", tg.themeParams.bg_color);
          }
          if (tg.themeParams.text_color) {
            root.style.setProperty("--tg-text-color", tg.themeParams.text_color);
          }
          if (tg.themeParams.button_color) {
            root.style.setProperty("--tg-button-color", tg.themeParams.button_color);
          }
          if (tg.themeParams.button_text_color) {
            root.style.setProperty("--tg-button-text-color", tg.themeParams.button_text_color);
          }
          if (tg.themeParams.secondary_bg_color) {
            root.style.setProperty("--tg-secondary-bg-color", tg.themeParams.secondary_bg_color);
          }
        }

        // Extract user data
        if (tg.initDataUnsafe?.user?.id) {
          setTelegramUserId(tg.initDataUnsafe.user.id);
        }

        // Set Main Button (optional - can be used for quick actions)
        if (tg.MainButton) {
          tg.MainButton.setText?.("Close");
          tg.MainButton.onClick?.(() => tg.close?.());
          // Don't show by default - show when needed per screen
          tg.MainButton.hide?.();
        }

        setIsWebAppReady(true);
      } else {
        // Browser mode (development)
        console.log("[AdminContext] Running in browser mode (no Telegram WebApp)");
        setIsWebAppReady(true);
      }
    } catch (error) {
      console.error("[AdminContext] Telegram WebApp init error:", error);
      setIsWebAppReady(true); // Fallback to allow app to run
    }
  }, []);

  // Initialize session (could be enhanced with Convex session creation later)
  useEffect(() => {
    const storedSessionId = localStorage.getItem("tedytech_admin_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate new session ID
      const newSessionId = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("tedytech_admin_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Process offline queue when connection is restored
  const convex = useConvex();
  useEffect(() => {
    const handleOnline = async () => {
      toast.online();
      const result = await processQueue(convex);
      if (result.processed > 0) {
        toast.synced();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [convex]);

  // Clear filter helpers
  const clearInventoryFilters = () => {
    setInventoryFilters({});
  };

  const clearOrdersFilters = () => {
    setOrdersFilters({});
  };

  const value: AdminContextType = {
    activeTab,
    setActiveTab,
    sessionId,
    telegramUserId,
    isWebAppReady,
    inventoryFilters,
    setInventoryFilters,
    clearInventoryFilters,
    ordersFilters,
    setOrdersFilters,
    clearOrdersFilters,
    isSidebarOpen,
    setSidebarOpen,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
