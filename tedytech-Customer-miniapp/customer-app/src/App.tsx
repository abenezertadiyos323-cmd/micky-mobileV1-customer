import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();
// Always use HashRouter: works in Telegram WebViews and regular browsers.
const Router = HashRouter;

// Silently normalises any unexpected hash that Telegram may open with
// (e.g. "#/earn", "#/start") to "#/" so the app always starts at Home.
// Runs exactly once on mount via replace so the browser history stays clean.
// Main-URL query params (Telegram's ?start_param etc.) are before the hash
// and are unaffected by this change.
function HashNormalizer() {
  const navigate = useNavigate();
  useEffect(() => {
    const path = window.location.hash.replace(/^#/, "") || "/";
    if (path !== "/") {
      navigate("/", { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

const App = () => {
  // Guard against the brief 404 flash that occurs when the router renders
  // before React state stabilises on first mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            {/* Normalise hash to "/" before any route renders */}
            <HashNormalizer />
            <Routes>
              {/* Single catch-all: any hash Telegram opens with always
                  renders the main app. NotFound is never shown. */}
              <Route path="*" element={<Index />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
