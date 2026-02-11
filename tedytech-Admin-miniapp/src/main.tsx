import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AdminProvider } from "@/contexts/AdminContext";
import { Toaster } from "sonner";
import { KonstaProvider } from "konsta/react";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
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
