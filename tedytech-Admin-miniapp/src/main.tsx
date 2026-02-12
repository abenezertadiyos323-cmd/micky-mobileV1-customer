import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AdminProvider } from "@/contexts/AdminContext";
import { Toaster } from "sonner";
import { KonstaProvider } from "konsta/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initGlobalErrorHandlers } from "@/lib/errorHandler";
import { validateEnv } from "@/lib/envValidation";
import App from "./App";
import "./index.css";

type RenderErrorDetails = {
  message: string;
  stack?: string;
};

const ensureRootElement = () => {
  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }
  return root;
};

const renderStartupMessage = (
  title: string,
  message: string,
  details?: RenderErrorDetails,
) => {
  const mount = ensureRootElement();
  createRoot(mount).render(
    <React.StrictMode>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 space-y-3 text-center shadow-sm">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
          {details?.message ? (
            <pre className="text-xs text-left bg-muted/40 p-3 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
              {details.stack ? `${details.message}\n\n${details.stack}` : details.message}
            </pre>
          ) : null}
        </div>
      </div>
    </React.StrictMode>,
  );
};

const formatError = (error: unknown): RenderErrorDetails => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
};

console.log("DEBUG: Convex URL is", import.meta.env.VITE_CONVEX_URL);
console.log("[AdminApp] Bootstrap start", {
  timestamp: new Date().toISOString(),
  mode: import.meta.env.MODE,
});
console.log(
  "[AdminApp] Telegram WebApp available at bootstrap:",
  Boolean((window as any).Telegram?.WebApp),
);

const bootstrap = () => {
  // Initialize global error handlers
  initGlobalErrorHandlers();

  // Validate environment variables
  console.log("[AdminApp] Validating environment");
  const { isValid, config, errors } = validateEnv();

  if (!isValid) {
    console.error("[AdminApp] Environment validation failed:", errors);
    renderStartupMessage(
      "Configuration Error",
      "The app is missing required environment variables:",
      {
        message: errors.join("\n"),
      },
    );
    return;
  }

  console.log("[AdminApp] Environment validated. Creating Convex client.", {
    convexUrl: config.VITE_CONVEX_URL,
    adminChatIdConfigured: Boolean(config.VITE_ADMIN_CHAT_ID),
  });

  const convex = new ConvexReactClient(config.VITE_CONVEX_URL);

  createRoot(ensureRootElement()).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ConvexProvider client={convex}>
          <KonstaProvider theme="ios">
            <AdminProvider>
              <App />
              <Toaster position="top-center" />
            </AdminProvider>
          </KonstaProvider>
        </ConvexProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
};

try {
  bootstrap();
} catch (error) {
  console.error("[AdminApp] Fatal bootstrap error", error);
  renderStartupMessage(
    "Startup Failed",
    "The app crashed before first render. See details below.",
    formatError(error),
  );
}