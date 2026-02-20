import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex_generated/api";

/** Active when running on localhost OR ?debug=1 query param is present. */
function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.hostname.includes("localhost")) return true;
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

const CONVEX_URL = (import.meta.env.VITE_CONVEX_URL ?? "") as string;
const CONVEX_URL_DISPLAY = CONVEX_URL
  ? `${CONVEX_URL.slice(0, 20)}***`
  : "(not set)";

function fmt(value: unknown): string {
  if (value === undefined) return "loading…";
  if (value === null) return "null ✅";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function DebugPanel() {
  const debug = isDebugMode();
  const [open, setOpen] = useState(true);
  const [runNoArgs, setRunNoArgs] = useState(false);
  const [runWithId, setRunWithId] = useState(false);

  // Hooks always run; skip=false only when debug is active and user clicked
  const noArgsResult = useQuery(
    api.affiliates.getAffiliateByCustomerId,
    debug && runNoArgs ? {} : "skip",
  );
  const withIdResult = useQuery(
    api.affiliates.getAffiliateByCustomerId,
    debug && runWithId ? { customerId: "test-user-123" } : "skip",
  );

  if (!debug) return null;

  const tgAvailable = Boolean(
    (window as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp,
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 80,
          right: 12,
          zIndex: 9999,
          background: "#1a1a2e",
          color: "#00d4ff",
          border: "1px solid #00d4ff",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        DEBUG
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        overflowY: "auto",
        padding: "16px 12px 80px",
        fontFamily: "monospace",
        fontSize: 12,
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: "#00d4ff", fontWeight: 700, fontSize: 13 }}>
          ⚙ CONVEX DEBUG PANEL
        </span>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: "none",
            border: "1px solid #555",
            color: "#aaa",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          minimize
        </button>
      </div>

      {/* Environment info */}
      <Row label="window.location.href" value={window.location.href} />
      <Row label="window.Telegram?.WebApp" value={String(tgAvailable)} highlight={!tgAvailable ? "warn" : "ok"} />
      <Row label="VITE_CONVEX_URL (first 20)" value={CONVEX_URL_DISPLAY} highlight={CONVEX_URL ? "ok" : "error"} />

      <hr style={{ border: "none", borderTop: "1px solid #333", margin: "12px 0" }} />

      {/* Query tests */}
      <div style={{ color: "#94a3b8", marginBottom: 8, fontSize: 11 }}>
        AFFILIATE QUERY TESTS
      </div>

      {/* Test A: no customerId */}
      <div style={{ marginBottom: 12, background: "#0f172a", borderRadius: 6, padding: 10 }}>
        <div style={{ color: "#64748b", marginBottom: 6, fontSize: 11 }}>
          A) getAffiliateByCustomerId( {} )
        </div>
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "#94a3b8" }}>result: </span>
          <span style={{ color: noArgsResult === null ? "#4ade80" : noArgsResult === undefined && runNoArgs ? "#fbbf24" : "#94a3b8" }}>
            {runNoArgs ? fmt(noArgsResult) : "(not run yet)"}
          </span>
        </div>
        <button
          onClick={() => setRunNoArgs(true)}
          disabled={runNoArgs}
          style={btnStyle(runNoArgs)}
        >
          {runNoArgs ? "running…" : "Run test A"}
        </button>
      </div>

      {/* Test B: customerId = test-user-123 */}
      <div style={{ marginBottom: 12, background: "#0f172a", borderRadius: 6, padding: 10 }}>
        <div style={{ color: "#64748b", marginBottom: 6, fontSize: 11 }}>
          B) getAffiliateByCustomerId( &#123; customerId: "test-user-123" &#125; )
        </div>
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "#94a3b8" }}>result: </span>
          <span style={{ color: withIdResult === null ? "#4ade80" : withIdResult === undefined && runWithId ? "#fbbf24" : "#94a3b8" }}>
            {runWithId ? fmt(withIdResult) : "(not run yet)"}
          </span>
        </div>
        <button
          onClick={() => setRunWithId(true)}
          disabled={runWithId}
          style={btnStyle(runWithId)}
        >
          {runWithId ? "running…" : "Run test B"}
        </button>
      </div>

      {/* Pass/fail summary */}
      {(runNoArgs || runWithId) && (
        <div style={{ marginTop: 8, padding: 10, background: "#0f172a", borderRadius: 6 }}>
          <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>SUMMARY</div>
          {runNoArgs && (
            <div>
              A:{" "}
              {noArgsResult === undefined
                ? "⏳ pending"
                : noArgsResult === null
                ? "✅ PASS — returned null"
                : "❌ FAIL — returned non-null: " + fmt(noArgsResult)}
            </div>
          )}
          {runWithId && (
            <div>
              B:{" "}
              {withIdResult === undefined
                ? "⏳ pending"
                : withIdResult === null
                ? "✅ PASS — returned null"
                : "✅ PASS — returned object (user exists)"}
            </div>
          )}
        </div>
      )}

      <hr style={{ border: "none", borderTop: "1px solid #333", margin: "12px 0" }} />
      <div style={{ color: "#475569", fontSize: 10 }}>
        Remove ?debug=1 from URL to hide this panel.
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "ok" | "warn" | "error";
}) {
  const color =
    highlight === "ok"
      ? "#4ade80"
      : highlight === "warn"
      ? "#fbbf24"
      : highlight === "error"
      ? "#f87171"
      : "#e2e8f0";
  return (
    <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
      <span style={{ color: "#64748b" }}>{label}: </span>
      <span style={{ color, wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "#1e293b" : "#0ea5e9",
    color: disabled ? "#475569" : "#fff",
    border: "none",
    borderRadius: 4,
    padding: "5px 12px",
    fontSize: 11,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "monospace",
  };
}
