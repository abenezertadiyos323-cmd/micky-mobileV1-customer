## Project description

Micky Mobile — a monorepo powering two Telegram Mini Apps (Customer and Admin) and a shared Convex backend. This file is the root-level single source of truth for Claude Code work; detailed frontend specs live in `tedytech-admin-miniapp/FRONTEND_SPEC.md` in the admin package.

## Micky Mobile system

- Customer Telegram Mini App (`tedytech-Customer-miniapp`): customer-facing Telegram Mini App for browsing phones, searching, favorites, actions, and checkout.
- Admin Telegram Mini App (`tedytech-admin-miniapp`): admin-facing Telegram Mini App for monitoring and managing activity (dashboard, inventory, exchanges/orders, inbox).
- Shared Convex backend (`convex`): single backend and data persistence for both apps.
- n8n on Railway: used for Telegram bot automations and external integrations (bot webhooks/workflows).
- Deployment: each mini app deployed independently to Vercel.

## Repo structure (important paths)

- `tedytech-Customer-miniapp` — Customer app source and configs.
- `tedytech-admin-miniapp` — Admin app source and configs (includes `tedytech-admin-miniapp/FRONTEND_SPEC.md` for detailed UI specs).
- `convex` — Convex backend code (functions, schema, generated API).
- `/.claude` — local Claude config (tooling / CI hints).

> Note: Root `claude.md` is the single source of truth for project structure, stack, and constraints. Detailed UI/UX for admin lives in `tedytech-admin-miniapp/FRONTEND_SPEC.md`.

## Tech stack rules

- Both mini apps:
  - Framework: React 18+ + Vite + TypeScript.
  - Styling: Tailwind CSS + Konsta UI (`konsta/react`) for mobile/Telegram-native components (cards, lists, navbar, sheets, etc.).
  - Icons: lucide-react only.
  - Telegram Mini App runtime: use `window.Telegram.WebApp` (`ready()`, `expand()`, theme sync, haptic feedback, BackButton/MainButton as needed). Apps must also run in a normal browser for local development (guard all Telegram calls).
- Backend: Convex is the only backend. No other databases or backend services for primary data/business logic.
- Deployment: Each mini app deployed independently to Vercel.
- Safety rule: Never add secrets into code. All tokens, keys, webhooks, etc. must be stored only in environment variables or platform secret stores (Vercel, Railway, Convex dashboard).

## Convex data model (high level)

Existing tables (from `convex/schema.ts`):

- `favorites` — user favorites (userId, phoneId, createdAt).
- `products` — product catalog (name, description, price, currency, images, category, tags, status, metadata, timestamps).
- `searches` — user search terms (userId?, term, createdAt).
- `sessions` — anonymous session records (createdAt).
- `phoneActions` — phone action requests (sessionId, phoneId, variantId?, actionType, createdAt).
- `exchangeRequests` — exchange submissions (sessionId, desiredPhoneId, offeredModel, offeredStorageGb, offeredCondition, offeredNotes, status, createdAt).
- `affiliates` — affiliate records (customerId, referralCode, createdAt).
- `affiliateCommissions` — commission records (affiliateId, orderId?, orderAmount, commissionPercent, commissionAmount, status, createdAt).

**Important constraint**: Do not add new tables or fields to the Convex schema unless explicitly requested and approved by the repository owner.

## Customer mini app — status & role

- Path: `tedytech-Customer-miniapp`
- Status: Production-ready, wired to Convex and Telegram SDK.
- Role: Primary customer-facing app (browsing, search, favorites, actions).
- Guidance: Refactors allowed but must preserve existing behaviors and data flows. Avoid breaking changes without explicit approval and tests.

## Admin mini app — goals & screens

- Path: `tedytech-admin-miniapp`
- Goal: Real-time admin dashboard for monitoring customer activity, managing inventory, handling exchanges/orders, and responding to leads.
- Core screens (as defined in `tedytech-admin-miniapp/FRONTEND_SPEC.md`):
  - Dashboard / Home (priority: Hot Leads / Key Activity)
  - Inventory / Phones
  - Orders / Exchanges
  - Inbox / Activity (optional initial version)
- Detailed UI/UX, workflow priorities, bulk actions, and offline handling are in `tedytech-admin-miniapp/FRONTEND_SPEC.md`.

## Tools & skills usage

- Frontend design skill: Required for all UI/layout/styling tasks (prefer Konsta UI components for cards/lists/navbar).
- Security/review skill: Required before any deploy — check for leaked secrets and obvious security issues.
- Realtime focus: Use Convex subscriptions heavily for live updates (hot leads, new actions, etc.).

## Secrets policy (explicit)

- Never commit secrets or plaintext credentials.
- Use environment variables and secure platform secret stores only.
- In code examples, use placeholders like `<YOUR_TOKEN>` and note that real values must come from env vars.

## Tasks for Claude (summary)

- Keep this root `claude.md` as the single source of truth for project structure, stack, and constraints.
- Always reference the existing Convex schema — no additions without explicit permission.
- For admin UI details, strictly follow `tedytech-admin-miniapp/FRONTEND_SPEC.md` (use Konsta UI components heavily for native Telegram look).
- Both apps are Telegram Mini Apps (use `window.Telegram.WebApp`) and must run in browser for dev.
- Prioritize mobile-first, realtime updates, and Ethiopian market realities (connectivity handling, high-volume leads, exchange priority).

