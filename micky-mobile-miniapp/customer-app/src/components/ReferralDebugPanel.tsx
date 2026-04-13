import React, { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Debug guard — same logic as AppContext.tsx IS_DEBUG and useAffiliate.ts.
// Evaluated once at module load. Returns false for all normal users.
// ---------------------------------------------------------------------------
const IS_DEBUG: boolean = (() => {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("debug") === "1") return true;
    if (localStorage.getItem("MICKY_MOBILE_DEBUG") === "1") return true;
  } catch { /* ignore */ }
  return false;
})();

const REF_DEBUG_KEY = "MICKY_MOBILE_REF_DEBUG_LAST";
const STATS_DEBUG_KEY = "MICKY_MOBILE_STATS_DEBUG_LAST";
const BUILD_SHA = "a2bb76c7"; // keep in sync with EarnTab build label

// ---------------------------------------------------------------------------
// Types — mirrors what AppContext.tsx and useAffiliate.ts write
// ---------------------------------------------------------------------------
interface RefDebug {
  capturedRefSource?: string;
  capturedRefRaw?: string;
  capturedRefCode?: string;
  referralMutationTriggered?: boolean;
  referralMutationResult?: string;
  referralMutationError?: string;
  timestampISO?: string;
}

interface StatsDebug {
  stats?: {
    referralCode?: string | null;
    totalReferredCount?: number;
    totalEarnings?: number;
    pendingEarnings?: number;
    paidEarnings?: number;
    commissionPercent?: number;
  };
  statsLoaded?: boolean;
  statsError?: string | null;
  timestampISO?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ReferralDebugPanel() {
  const [refDbg, setRefDbg] = useState<RefDebug | null>(null);
  const [statsDbg, setStatsDbg] = useState<StatsDebug | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => {
    setRefDbg(parseLS<RefDebug>(REF_DEBUG_KEY));
    setStatsDbg(parseLS<StatsDebug>(STATS_DEBUG_KEY));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Hidden for all normal users — IS_DEBUG is false unless ?debug=1 or MICKY_MOBILE_DEBUG=1.
  if (!IS_DEBUG) return null;

  const handleCopy = () => {
    const report = JSON.stringify(
      {
        buildSHA: BUILD_SHA,
        referral: refDbg,
        stats: statsDbg,
        url: window.location.href,
        ts: new Date().toISOString(),
      },
      null,
      2,
    );
    navigator.clipboard.writeText(report).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    try { localStorage.removeItem(REF_DEBUG_KEY); } catch { /* */ }
    try { localStorage.removeItem(STATS_DEBUG_KEY); } catch { /* */ }
    setRefDbg(null);
    setStatsDbg(null);
  };

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ color: "#00d4ff", fontWeight: 700, fontSize: 12 }}>
          [DEBUG] Referral Flow Inspector
        </span>
        <button onClick={refresh} style={miniBtnStyle}>refresh</button>
      </div>

      <Sect label="BUILD" />
      <Row label="sha" value={BUILD_SHA} />

      <Sect label="REFERRAL CAPTURE" />
      <Row label="source" value={refDbg?.capturedRefSource} />
      <Row label="raw" value={refDbg?.capturedRefRaw} />
      <Row label="code" value={refDbg?.capturedRefCode} />
      <Row label="mutationTriggered" value={refDbg?.referralMutationTriggered} />
      <Row
        label="mutationResult"
        value={refDbg?.referralMutationResult}
        ok={refDbg?.referralMutationResult === "success"}
        err={refDbg?.referralMutationResult === "error"}
      />
      <Row label="mutationError" value={refDbg?.referralMutationError || "—"} />
      <Row label="ts" value={refDbg?.timestampISO} />

      <Sect label="AFFILIATE STATS" />
      <Row label="referralCode" value={statsDbg?.stats?.referralCode} />
      <Row label="totalReferredCount" value={statsDbg?.stats?.totalReferredCount} />
      <Row label="totalEarnings" value={statsDbg?.stats?.totalEarnings} />
      <Row label="statsLoaded" value={statsDbg?.statsLoaded} />
      <Row label="statsError" value={statsDbg?.statsError ?? "—"} />
      <Row label="ts" value={statsDbg?.timestampISO} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={handleCopy} style={actionBtnStyle}>
          {copied ? "Copied!" : "Copy debug report"}
        </button>
        <button
          onClick={handleClear}
          style={{ ...actionBtnStyle, background: "#7f1d1d" }}
        >
          Clear debug
        </button>
      </div>

      <div style={{ color: "#334155", fontSize: 10, marginTop: 8 }}>
        Hidden unless ?debug=1 or localStorage MICKY_MOBILE_DEBUG=1
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function Sect({ label }: { label: string }) {
  return (
    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 10, marginBottom: 3 }}>
      {label}
    </div>
  );
}

function Row({
  label,
  value,
  ok,
  err,
}: {
  label: string;
  value: unknown;
  ok?: boolean;
  err?: boolean;
}) {
  const isEmpty = value === undefined || value === null || value === "";
  const color = err ? "#ef4444" : ok ? "#4ade80" : isEmpty ? "#475569" : "#e2e8f0";
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
      <span style={{ color: "#64748b" }}>{label}:</span>
      <span style={{ color, wordBreak: "break-all" }}>
        {isEmpty ? "—" : String(value)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const panelStyle: React.CSSProperties = {
  margin: "12px 0 0",
  padding: "10px 12px 14px",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  fontFamily: "monospace",
  fontSize: 11,
  color: "#e2e8f0",
};

const miniBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #475569",
  color: "#94a3b8",
  borderRadius: 4,
  padding: "1px 7px",
  cursor: "pointer",
  fontSize: 10,
  fontFamily: "monospace",
};

const actionBtnStyle: React.CSSProperties = {
  background: "#0ea5e9",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: "5px 12px",
  fontSize: 11,
  cursor: "pointer",
  fontFamily: "monospace",
};
