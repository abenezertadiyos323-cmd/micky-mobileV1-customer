import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "convex_generated/api";
import type { TabType, Filters } from "@/types/admin";
import { processQueue } from "@/lib/offlineQueue";
import { toast } from "@/lib/toast";

interface AdminContextType {
  // Active tab navigation.
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Session and auth.
  sessionId: string | null;
  telegramUserId: number | null;
  isWebAppReady: boolean;
  adminToken: string | null;
  isAuthorized: boolean | null;
  webAppError: string | null;

  // Inventory filters.
  inventoryFilters: Filters;
  setInventoryFilters: (filters: Filters) => void;
  clearInventoryFilters: () => void;

  // Orders filters.
  ordersFilters: Filters;
  setOrdersFilters: (filters: Filters) => void;
  clearOrdersFilters: () => void;

  // UI state.
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  // Navigation state.
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Session state.
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [telegramUserId, setTelegramUserId] = useState<number | null>(null);
  const [isWebAppReady, setIsWebAppReady] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [webAppError, setWebAppError] = useState<string | null>(null);

  // Filter states.
  const [inventoryFilters, setInventoryFilters] = useState<Filters>({});
  const [ordersFilters, setOrdersFilters] = useState<Filters>({});

  // UI state.
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Initialize Telegram WebApp.
  useEffect(() => {
    let didCleanup = false;
    let resolved = false;

    const markReady = (errorMessage: string | null) => {
      if (didCleanup || resolved) return;
      resolved = true;
      setWebAppError(errorMessage);
      setIsWebAppReady(true);
    };

    const timeoutId = window.setTimeout(() => {
      console.error("[AdminContext] Telegram WebApp initialization timed out");
      markReady(
        "Telegram WebApp initialization timed out. Open the app from Telegram again.",
      );
    }, 5000);

    try {
      const tg = window.Telegram?.WebApp;

      if (tg) {
        console.log("[AdminContext] Telegram WebApp detected", {
          version: (tg as any).version,
          platform: (tg as any).platform,
        });

        tg.ready?.();
        tg.expand?.();

        // Apply Telegram color scheme: dark by default, switch to light if Telegram says so.
        const root = document.documentElement;
        if ((tg as any).colorScheme === "light") {
          root.classList.remove("dark");
        }

        if (tg.themeParams) {
          if (tg.themeParams.bg_color) {
            root.style.setProperty("--tg-bg-color", tg.themeParams.bg_color);
          }
          if (tg.themeParams.text_color) {
            root.style.setProperty(
              "--tg-text-color",
              tg.themeParams.text_color,
            );
          }
          if (tg.themeParams.button_color) {
            root.style.setProperty(
              "--tg-button-color",
              tg.themeParams.button_color,
            );
          }
          if (tg.themeParams.button_text_color) {
            root.style.setProperty(
              "--tg-button-text-color",
              tg.themeParams.button_text_color,
            );
          }
          if (tg.themeParams.secondary_bg_color) {
            root.style.setProperty(
              "--tg-secondary-bg-color",
              tg.themeParams.secondary_bg_color,
            );
          }
        }

        if (tg.initDataUnsafe?.user?.id) {
          setTelegramUserId(tg.initDataUnsafe.user.id);
        }

        if (tg.MainButton) {
          tg.MainButton.setText?.("Close");
          tg.MainButton.onClick?.(() => tg.close?.());
          tg.MainButton.hide?.();
        }

        markReady(null);
      } else if (import.meta.env.DEV) {
        console.log(
          "[AdminContext] Running in browser dev mode (Telegram WebApp not detected)",
        );
        markReady(null);
      } else {
        console.error(
          "[AdminContext] Telegram WebApp SDK not detected in production",
        );
        markReady(
          "Telegram WebApp SDK is unavailable. Ensure telegram-web-app.js is loaded.",
        );
      }
    } catch (error) {
      console.error("[AdminContext] Telegram WebApp init error", error);
      markReady(
        "Telegram WebApp failed to initialize. Check Telegram Inspect logs.",
      );
    }

    return () => {
      didCleanup = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  // Initialize session (can be enhanced with Convex session creation later).
  useEffect(() => {
    const storedSessionId = localStorage.getItem("tedytech_admin_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("tedytech_admin_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Process offline queue when connection is restored.
  const convex = useConvex();
  useEffect(() => {
    const handleOnline = async () => {
      toast.online();
      const result = await processQueue(convex);
      if (result.processed > 0) {
        toast.synced();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [convex]);

  const clearInventoryFilters = () => {
    setInventoryFilters({});
  };

  const clearOrdersFilters = () => {
    setOrdersFilters({});
  };

  // Try to authenticate with Convex when Telegram is ready
  const authenticate = useMutation(
    api.mutations.sellers.authenticateWithTelegram,
  );
  useEffect(() => {
    const tryAuth = async () => {
      if (!isWebAppReady) return;
      if (!telegramUserId) return;
      if (adminToken) return; // already authenticated

      const ALLOWED = import.meta.env.VITE_ADMIN_CHAT_ID || "";
      if (ALLOWED && String(telegramUserId) !== String(ALLOWED)) {
        setIsAuthorized(false);
        return;
      }

      try {
        const resp = await authenticate({
          telegramId: String(telegramUserId),
          username: (window.Telegram?.WebApp as any)?.initDataUnsafe?.user
            ?.username,
          firstName: (window.Telegram?.WebApp as any)?.initDataUnsafe?.user
            ?.first_name,
          lastName: (window.Telegram?.WebApp as any)?.initDataUnsafe?.user
            ?.last_name,
        });

        if (resp && resp.token) {
          setAdminToken(resp.token);
          localStorage.setItem("tedytech_admin_token", resp.token);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("[AdminContext] authentication failed", err);
        setIsAuthorized(false);
      }
    };

    tryAuth();
  }, [isWebAppReady, telegramUserId, adminToken, authenticate]);

  const value: AdminContextType = {
    activeTab,
    setActiveTab,
    sessionId,
    telegramUserId,
    isWebAppReady,
    adminToken,
    isAuthorized,
    webAppError,
    inventoryFilters,
    setInventoryFilters,
    clearInventoryFilters,
    ordersFilters,
    setOrdersFilters,
    clearOrdersFilters,
    isSidebarOpen,
    setSidebarOpen,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
