import { useState } from "react";

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type QState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: unknown }
  | {
      status: "error";
      message: string;
      stackLines: string[];
      requestId: string | null;
    };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractRequestId(text: string): string | null {
  const m = text.match(/\[Request ID:\s*([a-f0-9]+)\]/i);
  return m ? m[1] : null;
}

function firstNLines(s: string, n: number): string[] {
  return s.split("\n").slice(0, n).filter(Boolean);
}

/**
 * Call Convex HTTP query API imperatively.
 * Using fetch (not useQuery) so we can try/catch every error.
 */
async function callConvexQuery(
  args: Record<string, unknown>,
): Promise<QState> {
  if (!CONVEX_URL) {
    return {
      status: "error",
      message: "VITE_CONVEX_URL is not set — cannot reach Convex.",
      stackLines: [],
      requestId: null,
    };
  }
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "affiliates:getAffiliateByCustomerId",
        args,
        format: "json",
      }),
    });
    const json = (await res.json()) as {
      status?: string;
      value?: unknown;
      errorMessage?: string;
      errorData?: { stack?: string } | null;
    };

    if (json.status === "success") {
      return { status: "success", data: json.value ?? null };
    }

    // Convex returns status:"error" with errorMessage
    const msg = String(json.errorMessage ?? "Unknown Convex error");
    const requestId = extractRequestId(msg);
    const rawStack = json.errorData?.stack ?? "";
    const stackLines =
      rawStack
        ? firstNLines(rawStack, 5)
        : firstNLines(msg, 5);
    return { status: "error", message: msg, stackLines, requestId };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return {
      status: "error",
      message: err.message,
      stackLines: firstNLines(err.stack ?? "", 5),
      requestId: extractRequestId(err.message),
    };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DebugPanel() {
  const [open, setOpen] = useState(true);
  const [stateA, setStateA] = useState<QState>({ status: "idle" });
  const [stateB, setStateB] = useState<QState>({ status: "idle" });

  if (!isDebugMode()) return null;

  const tgAvailable = Boolean(
    (window as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp,
  );

  async function runA() {
    setStateA({ status: "loading" });
    setStateA(await callConvexQuery({}));
  }

  async function runB() {
    setStateB({ status: "loading" });
    setStateB(await callConvexQuery({ customerId: "test-user-123" }));
  }

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
        background: "rgba(0,0,0,0.9)",
        overflowY: "auto",
        padding: "16px 12px 80px",
        fontFamily: "monospace",
        fontSize: 12,
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span style={{ color: "#00d4ff", fontWeight: 700, fontSize: 13 }}>
          ⚙ CONVEX DEBUG PANEL
        </span>
        <button onClick={() => setOpen(false)} style={miniBtnStyle}>
          minimize
        </button>
      </div>

      {/* Environment rows */}
      <Row label="window.location.href" value={window.location.href} />
      <Row
        label="window.Telegram?.WebApp"
        value={String(tgAvailable)}
        highlight={tgAvailable ? "ok" : "warn"}
      />
      <Row
        label="VITE_CONVEX_URL (first 20)"
        value={CONVEX_URL_DISPLAY}
        highlight={CONVEX_URL ? "ok" : "error"}
      />

      <Divider />

      <SectionLabel>AFFILIATE QUERY TESTS</SectionLabel>

      <TestBlock
        label='A) getAffiliateByCustomerId( {} )'
        state={stateA}
        onRun={runA}
      />

      <TestBlock
        label='B) getAffiliateByCustomerId( { customerId: "test-user-123" } )'
        state={stateB}
        onRun={runB}
      />

      {/* Summary */}
      {(stateA.status !== "idle" || stateB.status !== "idle") && (
        <div
          style={{
            marginTop: 8,
            padding: 10,
            background: "#0f172a",
            borderRadius: 6,
          }}
        >
          <SectionLabel>SUMMARY</SectionLabel>
          <SummaryLine label="A" state={stateA} />
          <SummaryLine label="B" state={stateB} />
        </div>
      )}

      <Divider />
      <div style={{ color: "#475569", fontSize: 10 }}>
        Remove ?debug=1 from URL to hide this panel.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TestBlock({
  label,
  state,
  onRun,
}: {
  label: string;
  state: QState;
  onRun: () => void;
}) {
  const busy = state.status === "loading";
  return (
    <div
      style={{
        marginBottom: 12,
        background: "#0f172a",
        borderRadius: 6,
        padding: 10,
      }}
    >
      <div style={{ color: "#64748b", marginBottom: 6, fontSize: 11 }}>
        {label}
      </div>

      {state.status === "idle" && (
        <div style={{ color: "#475569", marginBottom: 6 }}>
          (not run yet)
        </div>
      )}

      {state.status === "loading" && (
        <div style={{ color: "#fbbf24", marginBottom: 6 }}>loading…</div>
      )}

      {state.status === "success" && (
        <div style={{ color: "#4ade80", marginBottom: 6, wordBreak: "break-all" }}>
          result: {state.data === null ? "null ✅" : JSON.stringify(state.data)}
        </div>
      )}

      {state.status === "error" && (
        <div style={{ marginBottom: 6 }}>
          <div style={{ color: "#f87171", marginBottom: 4 }}>
            ❌ error: {state.message}
          </div>
          {state.requestId && (
            <div style={{ color: "#fbbf24", marginBottom: 4 }}>
              Request ID: {state.requestId}
            </div>
          )}
          {state.stackLines.length > 0 && (
            <pre
              style={{
                color: "#94a3b8",
                fontSize: 10,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                margin: 0,
                background: "#020617",
                padding: 6,
                borderRadius: 4,
              }}
            >
              {state.stackLines.join("\n")}
            </pre>
          )}
        </div>
      )}

      <button
        onClick={onRun}
        disabled={busy}
        style={btnStyle(busy)}
      >
        {busy ? "running…" : state.status !== "idle" ? "Re-run" : "Run"}
      </button>
    </div>
  );
}

function SummaryLine({ label, state }: { label: string; state: QState }) {
  if (state.status === "idle") return null;
  const text =
    state.status === "loading"
      ? "⏳ pending"
      : state.status === "success"
      ? state.data === null
        ? "✅ PASS — null"
        : "✅ PASS — " + JSON.stringify(state.data)
      : "❌ FAIL — " + state.message.slice(0, 80);
  return (
    <div style={{ marginBottom: 2 }}>
      {label}: {text}
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

function Divider() {
  return (
    <hr
      style={{ border: "none", borderTop: "1px solid #333", margin: "12px 0" }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: "#94a3b8", marginBottom: 8, fontSize: 11 }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const miniBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #555",
  color: "#aaa",
  borderRadius: 4,
  padding: "2px 8px",
  cursor: "pointer",
  fontSize: 11,
  fontFamily: "monospace",
};

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
