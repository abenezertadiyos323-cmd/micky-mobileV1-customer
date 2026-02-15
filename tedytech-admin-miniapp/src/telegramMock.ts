/**
 * Telegram WebApp Mock for Development
 *
 * Provides a lightweight mock of window.Telegram.WebApp for testing
 * the Admin miniapp in a normal browser. In production (inside Telegram),
 * the real Telegram.WebApp will be available.
 */

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: number;
    hash: string;
  };
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  headerColor: string;
  backgroundColor: string;
  textColor: string;
  hint_color: string;
  version: string;
  platform: string;
  isExpanded: boolean;
  isClosingConfirmationEnabled: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: string) => void;
    notificationOccurred: (type: string) => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    setItem: (
      key: string,
      value: string,
      callback?: (error: string | null) => void,
    ) => void;
    getItem: (
      key: string,
      callback: (error: string | null, value: string | null) => void,
    ) => void;
    removeItem: (
      key: string,
      callback?: (error: string | null) => void,
    ) => void;
    getKeys: (callback: (error: string | null, keys: string[]) => void) => void;
  };
  onEvent: (eventType: string, callback: (data?: any) => void) => void;
  offEvent: (eventType: string, callback: (data?: any) => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (
    params: any,
    callback?: (buttonId: string | null) => void,
  ) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
  showScanQrPopup: (
    params: any,
    callback?: (data: string | null) => void,
  ) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback: (text: string | null) => void) => void;
  shareToStory: (
    media_url: string,
    params?: any,
    callback?: (result: boolean) => void,
  ) => void;
  shareURL: (url: string, text?: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  requestWriteAccess: (callback?: (allowed: boolean) => void) => void;
  requestContactAccess: (callback?: (allowed: boolean) => void) => void;
  invokeCustomMethod: (
    method: string,
    params?: Record<string, any>,
    callback?: (error: string | null, result: any) => void,
  ) => void;
}

/**
 * Create a mock Telegram.WebApp object for development.
 * This allows testing the UI in a regular browser without needing the Telegram client.
 */
function createMockWebApp(): TelegramWebApp {
  return {
    ready: () => {
      console.log("[Telegram Mock] WebApp.ready() called");
    },
    expand: () => {
      console.log("[Telegram Mock] WebApp.expand() called");
      document.body.style.height = "100vh";
    },
    close: () => {
      console.log("[Telegram Mock] WebApp.close() called");
    },
    initData: "mock_init_data",
    initDataUnsafe: {
      user: {
        id: 123456789,
        is_bot: false,
        first_name: "Admin",
        last_name: "User",
        username: "adminuser",
        language_code: "en",
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: "mock_hash",
    },
    colorScheme: "dark",
    themeParams: {},
    headerColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    hint_color: "#999999",
    version: "6.0",
    platform: "web",
    isExpanded: true,
    isClosingConfirmationEnabled: false,
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    MainButton: {
      text: "Main Button",
      color: "#2ca5e0",
      textColor: "#ffffff",
      isVisible: false,
      isActive: true,
      isProgressVisible: false,
      setText: (text: string) => {
        console.log(`[Telegram Mock] MainButton.setText("${text}")`);
        // Mock: state change not persisted
      },
      onClick: (callback: () => void) => {
        console.log("[Telegram Mock] MainButton.onClick registered");
        // For testing, optionally call the callback
      },
      show: () => {
        console.log("[Telegram Mock] MainButton.show()");
        // Mock: state change not persisted
      },
      hide: () => {
        console.log("[Telegram Mock] MainButton.hide()");
        // Mock: state change not persisted
      },
      enable: () => {
        console.log("[Telegram Mock] MainButton.enable()");
        // Mock: state change not persisted
      },
      disable: () => {
        console.log("[Telegram Mock] MainButton.disable()");
        // Mock: state change not persisted
      },
      showProgress: (leaveActive?: boolean) => {
        console.log("[Telegram Mock] MainButton.showProgress()");
        // Mock: state change not persisted
      },
      hideProgress: () => {
        console.log("[Telegram Mock] MainButton.hideProgress()");
        // Mock: state change not persisted
      },
    },
    BackButton: {
      isVisible: false,
      onClick: (callback: () => void) => {
        console.log("[Telegram Mock] BackButton.onClick registered");
      },
      show: () => {
        console.log("[Telegram Mock] BackButton.show()");
        // Mock: state change not persisted
      },
      hide: () => {
        console.log("[Telegram Mock] BackButton.hide()");
        // Mock: state change not persisted
      },
    },
    HapticFeedback: {
      impactOccurred: (style: string) => {
        console.log(
          `[Telegram Mock] HapticFeedback.impactOccurred("${style}")`,
        );
      },
      notificationOccurred: (type: string) => {
        console.log(
          `[Telegram Mock] HapticFeedback.notificationOccurred("${type}")`,
        );
      },
      selectionChanged: () => {
        console.log("[Telegram Mock] HapticFeedback.selectionChanged()");
      },
    },
    CloudStorage: {
      setItem: (
        key: string,
        value: string,
        callback?: (error: string | null) => void,
      ) => {
        console.log(`[Telegram Mock] CloudStorage.setItem("${key}", "...")`);
        if (callback) callback(null);
      },
      getItem: (
        key: string,
        callback: (error: string | null, value: string | null) => void,
      ) => {
        console.log(`[Telegram Mock] CloudStorage.getItem("${key}")`);
        callback(null, null);
      },
      removeItem: (key: string, callback?: (error: string | null) => void) => {
        console.log(`[Telegram Mock] CloudStorage.removeItem("${key}")`);
        if (callback) callback(null);
      },
      getKeys: (callback: (error: string | null, keys: string[]) => void) => {
        console.log("[Telegram Mock] CloudStorage.getKeys()");
        callback(null, []);
      },
    },
    onEvent: (eventType: string, callback: (data?: any) => void) => {
      console.log(`[Telegram Mock] onEvent("${eventType}") registered`);
    },
    offEvent: (eventType: string, callback: (data?: any) => void) => {
      console.log(`[Telegram Mock] offEvent("${eventType}")`);
    },
    sendData: (data: string) => {
      console.log(`[Telegram Mock] sendData("${data}")`);
    },
    openLink: (url: string, options?: { try_instant_view?: boolean }) => {
      console.log(`[Telegram Mock] openLink("${url}")`);
      window.open(url, "_blank");
    },
    openInvoice: (url: string, callback?: (status: string) => void) => {
      console.log(`[Telegram Mock] openInvoice("${url}")`);
      if (callback) callback("paid");
    },
    showPopup: (params: any, callback?: (buttonId: string | null) => void) => {
      console.log("[Telegram Mock] showPopup()", params);
      if (callback) callback(null);
    },
    showAlert: (message: string, callback?: () => void) => {
      console.log(`[Telegram Mock] showAlert("${message}")`);
      alert(message);
      if (callback) callback();
    },
    showConfirm: (message: string, callback?: (ok: boolean) => void) => {
      console.log(`[Telegram Mock] showConfirm("${message}")`);
      const ok = confirm(message);
      if (callback) callback(ok);
    },
    showScanQrPopup: (
      params: any,
      callback?: (data: string | null) => void,
    ) => {
      console.log("[Telegram Mock] showScanQrPopup()", params);
      if (callback) callback(null);
    },
    closeScanQrPopup: () => {
      console.log("[Telegram Mock] closeScanQrPopup()");
    },
    readTextFromClipboard: (callback: (text: string | null) => void) => {
      console.log("[Telegram Mock] readTextFromClipboard()");
      callback(null);
    },
    shareToStory: (
      media_url: string,
      params?: any,
      callback?: (result: boolean) => void,
    ) => {
      console.log(`[Telegram Mock] shareToStory("${media_url}")`);
      if (callback) callback(true);
    },
    shareURL: (url: string, text?: string) => {
      console.log(`[Telegram Mock] shareURL("${url}", "${text || ""}")`);
    },
    switchInlineQuery: (query: string, choose_chat_types?: string[]) => {
      console.log(`[Telegram Mock] switchInlineQuery("${query}")`);
    },
    requestWriteAccess: (callback?: (allowed: boolean) => void) => {
      console.log("[Telegram Mock] requestWriteAccess()");
      if (callback) callback(true);
    },
    requestContactAccess: (callback?: (allowed: boolean) => void) => {
      console.log("[Telegram Mock] requestContactAccess()");
      if (callback) callback(true);
    },
    invokeCustomMethod: (
      method: string,
      params?: Record<string, any>,
      callback?: (error: string | null, result: any) => void,
    ) => {
      console.log(`[Telegram Mock] invokeCustomMethod("${method}")`, params);
      if (callback) callback(null, null);
    },
  };
}

/**
 * Initialize Telegram WebApp.
 * If running in Telegram, use the real window.Telegram.WebApp.
 * Otherwise, inject the mock for development.
 */
export function initTelegramWebApp(): void {
  // Check if we're inside Telegram (Telegram.WebApp is available)
  if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
    console.log("[Telegram] Real Telegram.WebApp detected");
    (window as any).Telegram.WebApp.ready();
    (window as any).Telegram.WebApp.expand();
  } else {
    // In development, inject the mock
    console.log("[Telegram Mock] Injecting mock Telegram.WebApp");
    if (typeof window !== "undefined") {
      (window as any).Telegram = {
        WebApp: createMockWebApp(),
      };
    }
  }
}

// Declare window type for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
