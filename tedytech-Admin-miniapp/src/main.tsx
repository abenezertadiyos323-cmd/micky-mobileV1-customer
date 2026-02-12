import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AdminProvider } from "@/contexts/AdminContext";
import { Toaster } from "sonner";
import { KonstaProvider } from "konsta/react";
import App from "./App";
import "./index.css";

console.log("DEBUG: Convex URL is", import.meta.env.VITE_CONVEX_URL);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

const renderStartupMessage = (title: string, message: string) => {
  createRoot(rootElement).render(
    <React.StrictMode>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 space-y-3 text-center shadow-sm">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </React.StrictMode>,
  );
};

console.log("[AdminApp] Bootstrap start", {
  timestamp: new Date().toISOString(),
  mode: import.meta.env.MODE,
});
console.log("[AdminApp] Telegram WebApp available at bootstrap:", Boolean((window as any).Telegram?.WebApp));

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error("[AdminApp] Missing VITE_CONVEX_URL. App cannot connect to Convex.");
  renderStartupMessage(
    "Configuration Missing",
    "VITE_CONVEX_URL is not configured. Add it to your environment variables and rebuild the app.",
  );
} else {
  try {
    console.log("[AdminApp] VITE_CONVEX_URL detected. Creating Convex client.", { convexUrl });
    const convex = new ConvexReactClient(convexUrl);

    createRoot(rootElement).render(
      <React.StrictMode>
        <ConvexProvider client={convex}>
          <KonstaProvider theme="ios">
            <AdminProvider>
              <App />
              <Toaster position="top-center" />
            </AdminProvider>
          </KonstaProvider>
        </ConvexProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("[AdminApp] Convex initialization failed", error);
    renderStartupMessage(
      "Configuration Missing",
      "Failed to initialize Convex. Verify VITE_CONVEX_URL points to a valid Convex deployment.",
    );
  }
}
