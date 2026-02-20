import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import "./index.css";

// ---------------------------------------------------------------------------
// Environment validation - Vite bakes these at build time.
// If VITE_CONVEX_URL is missing the production build will be broken.
// ---------------------------------------------------------------------------
const _convexUrl = (import.meta.env.VITE_CONVEX_URL ?? "") as string;

type RuntimeTgWebApp = {
  initData?: string;
};

interface CrashInfo {
  name: string;
  message: string;
  stack?: string;
  locationHref: string;
  hasTelegramWebApp: boolean;
  initDataLength: number | null;
}

function getTelegramWebApp(): RuntimeTgWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as { Telegram?: { WebApp?: RuntimeTgWebApp } }).Telegram?.WebApp;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function normalizeError(error: unknown): {
  name: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: error.message || "Unknown runtime error",
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return { name: "Error", message: error };
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      name?: unknown;
      message?: unknown;
      stack?: unknown;
    };
    const name =
      typeof candidate.name === "string" && candidate.name.trim()
        ? candidate.name
        : "Error";
    const message =
      typeof candidate.message === "string" && candidate.message.trim()
        ? candidate.message
        : safeStringify(error);
    const stack = typeof candidate.stack === "string" ? candidate.stack : undefined;
    return { name, message, stack };
  }

  return { name: "Error", message: String(error) };
}

function buildCrashInfo(error: unknown): CrashInfo {
  const normalized = normalizeError(error);
  const tg = getTelegramWebApp();

  return {
    name: normalized.name,
    message: normalized.message,
    stack: normalized.stack,
    locationHref:
      typeof window !== "undefined" ? window.location.href : "window unavailable",
    hasTelegramWebApp: Boolean(tg),
    initDataLength: typeof tg?.initData === "string" ? tg.initData.length : null,
  };
}

/** Render a plain-HTML error before React mounts (e.g. missing env var). */
function renderStaticError(title: string, message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:#0a0a0a;font-family:system-ui,sans-serif">
      <div style="width:100%;max-width:24rem;border:1px solid #333;border-radius:1rem;background:#111;padding:1.5rem;text-align:center;color:#fff">
        <h1 style="font-size:1.1rem;font-weight:600;margin:0 0 .5rem 0">${title}</h1>
        <p style="font-size:.875rem;color:#888;margin:0">${message}</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// React components
// ---------------------------------------------------------------------------

function CrashScreen({
  crashInfo,
  onReload,
}: {
  crashInfo: CrashInfo;
  onReload: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-background px-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center">
        <h1 className="text-lg font-semibold">App crashed</h1>
        <div className="mt-3 rounded bg-muted/60 p-3 text-left text-xs break-all space-y-1">
          <p>error.name: {crashInfo.name}</p>
          <p>error.message: {crashInfo.message}</p>
          <p>window.location.href: {crashInfo.locationHref}</p>
          <p>Boolean(window.Telegram?.WebApp): {String(crashInfo.hasTelegramWebApp)}</p>
          <p>
            window.Telegram?.WebApp?.initData length: {" "}
            {crashInfo.initDataLength === null ? "(missing)" : crashInfo.initDataLength}
          </p>
        </div>
        {crashInfo.stack ? (
          <pre className="mt-3 text-left text-xs bg-muted/60 rounded p-2 overflow-auto max-h-48 whitespace-pre-wrap break-all">
            {`error.stack:\n${crashInfo.stack}`}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={onReload}
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component<
  {
    onCrash: (error: unknown) => void;
    children: React.ReactNode;
  },
  { hasError: boolean; crashInfo: CrashInfo | null }
> {
  constructor(props: {
    onCrash: (error: unknown) => void;
    children: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, crashInfo: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      crashInfo: buildCrashInfo(error),
    };
  }

  componentDidCatch(error: unknown) {
    this.props.onCrash(error);
  }

  render() {
    if (this.state.hasError && this.state.crashInfo) {
      return (
        <CrashScreen
          crashInfo={this.state.crashInfo}
          onReload={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

function RootApp() {
  const [crashInfo, setCrashInfo] = React.useState<CrashInfo | null>(null);

  const reportCrash = React.useCallback((error: unknown) => {
    setCrashInfo((previous) => previous ?? buildCrashInfo(error));
  }, []);

  React.useEffect(() => {
    const previousOnError = window.onerror;
    const previousOnUnhandledRejection = window.onunhandledrejection;

    window.onerror = (message, source, lineno, colno, error) => {
      if (error) {
        reportCrash(error);
      } else {
        const fallback = new Error(String(message));
        fallback.name = "WindowError";
        if (source) {
          fallback.stack = `${source}:${lineno}:${colno}`;
        }
        reportCrash(fallback);
      }
      if (typeof previousOnError === "function") {
        return previousOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    window.onunhandledrejection = (event) => {
      reportCrash(event.reason);
      if (typeof previousOnUnhandledRejection === "function") {
        return previousOnUnhandledRejection.call(window, event);
      }
      return;
    };

    return () => {
      window.onerror = previousOnError ?? null;
      window.onunhandledrejection = previousOnUnhandledRejection ?? null;
    };
  }, [reportCrash]);

  if (crashInfo) {
    return <CrashScreen crashInfo={crashInfo} onReload={() => window.location.reload()} />;
  }

  return (
    <AppErrorBoundary onCrash={(error) => reportCrash(error)}>
      <App />
    </AppErrorBoundary>
  );
}

// ---------------------------------------------------------------------------
// Bootstrap - validate env, create client, mount React
// ---------------------------------------------------------------------------

function startApp() {
  // Guard: VITE_CONVEX_URL must be a valid https URL baked in at build time.
  if (!_convexUrl || !_convexUrl.startsWith("https://")) {
    renderStaticError(
      "Configuration Error",
      "Missing or invalid VITE_CONVEX_URL in Vercel environment variables. " +
        "Set VITE_CONVEX_URL to your Convex deployment URL (e.g. https://xxx.convex.cloud) and redeploy.",
    );
    return;
  }

  let convex: ConvexReactClient;
  try {
    convex = new ConvexReactClient(_convexUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    renderStaticError("Convex Initialization Error", msg);
    return;
  }

  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  createRoot(rootEl).render(
    <ConvexProvider client={convex}>
      <RootApp />
    </ConvexProvider>,
  );
}

startApp();
