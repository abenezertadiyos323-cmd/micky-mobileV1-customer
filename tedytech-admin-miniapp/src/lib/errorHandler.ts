import { toast } from "sonner";

export interface ErrorContext {
  timestamp: string;
  userAgent: string;
  url: string;
  telegramUserId?: number;
  sessionId?: string;
}

export function initGlobalErrorHandlers() {
  console.log("[ErrorHandler] Initializing global error handlers");

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    console.error("[ErrorHandler] Unhandled Promise Rejection:", {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
    });

    // Prevent default browser error handling
    event.preventDefault();

    // Show user-friendly toast
    const message = event.reason?.message || String(event.reason);
    toast.error(`Unexpected error: ${message}`);

    // Send to monitoring service (future)
    // reportError(event.reason, { type: 'unhandledrejection' });
  });

  // Handle uncaught errors
  window.addEventListener("error", (event) => {
    console.error("[ErrorHandler] Uncaught Error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
    });

    // Show user-friendly toast
    toast.error(`Error: ${event.message}`);

    // Send to monitoring service (future)
    // reportError(event.error, { type: 'error' });
  });

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "SCRIPT") {
        console.error("[ErrorHandler] Resource failed to load:", {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
          timestamp: new Date().toISOString(),
        });
      }
    },
    true, // Use capture phase to catch resource errors
  );

  console.log("[ErrorHandler] Global error handlers initialized");
}

export function safeJsonParse<T>(
  jsonString: string,
  fallback: T,
  context?: string,
): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(
      `[ErrorHandler] JSON parse error${context ? ` in ${context}` : ""}:`,
      {
        error,
        input: jsonString.substring(0, 100), // Log first 100 chars
      },
    );
    return fallback;
  }
}

export function safeLocalStorage<T>(
  operation: "get" | "set" | "remove",
  key: string,
  value?: T,
): T | null {
  try {
    switch (operation) {
      case "get": {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      case "set":
        localStorage.setItem(key, JSON.stringify(value));
        return value ?? null;
      case "remove":
        localStorage.removeItem(key);
        return null;
    }
  } catch (error) {
    console.error(`[ErrorHandler] localStorage ${operation} failed:`, {
      key,
      error,
    });
    return null;
  }
}
