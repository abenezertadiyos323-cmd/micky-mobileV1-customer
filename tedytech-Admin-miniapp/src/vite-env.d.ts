/// <reference types="vite/client" />

import type { TelegramWebApp } from "./telegramMock";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
