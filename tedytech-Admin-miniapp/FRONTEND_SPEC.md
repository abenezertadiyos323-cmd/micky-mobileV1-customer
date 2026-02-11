# FRONTEND SPEC – TedyTech Admin Telegram Mini App

## ROLE & GOAL

You are acting as a **senior frontend product engineer and UI/UX designer**.

Your task is to build a **production-ready frontend for the Admin Telegram Mini App** for **TedyTech**, an Ethiopian phone resale business.

This spec describes **screens and frontend style**.  
Backend logic and data come from the existing **Convex** backend described in `claude.md`.

---

## QUICK CODING RULES (Added for efficiency)

- Framework: React 18+ + Vite + TypeScript
- Styling: Tailwind CSS + Konsta UI (konsta/react)
  - Utility classes heavily
  - Responsive utilities preferred
- Icons: lucide-react only (`import { IconName } from 'lucide-react'`)
- Telegram Integration (MANDATORY):
  - Use `window.Telegram.WebApp` directly
  - On mount: `Telegram.WebApp.ready()` and `Telegram.WebApp.expand()`
  - Theme sync (future dark mode ready): `document.body.className = Telegram.WebApp.colorScheme === 'dark' ? 'dark' : ''`
  - BackButton/MainButton/HapticFeedback as needed
  - Guard all Telegram calls so app works in normal browser for dev
  - InitData validation: call Convex auth mutation on load (redirect if not admin)
- State & Data: Convex only (useQuery/useMutation/useSubscription for realtime)
- Mobile/Performance:
  - Mobile-first, portrait only
  - Touch targets ≥44px
  - No horizontal scroll (full-width vertical scrolling for native Telegram feel)
  - Lazy load lists/images
- Testing: Must run in browser dev server AND real Telegram Mini App

## PROMPTING RULES FOR CLAUDE CODE

- Always start prompts: "Strictly follow this FRONTEND spec and root claude.md."
- Scope small: one component or page per prompt
- Use Tailwind + lucide-react
- Mention context files when needed

---
## KONSTA UI RULES (Preferred for Native Telegram Look)

- Import: `from 'konsta/react'`
- Root wrapper: Always use `<App theme="ios">` (iOS style matches Telegram best)
- Page structure: `<Page>` inside `<App>` for each screen
- Theme sync: Use `Telegram.WebApp.colorScheme` to add 'dark' class on body
- Preferred components (use these first for consistency and speed):
  - `<Block>` / `<Block strong inset>` — Content sections, cards containers
  - `<Card>` — Stat cards, product cards, hot lead cards (perfect for dashboard)
  - `<List>` / `<ListItem>` — Lists (inventory rows, inbox items, hot leads list) with media, chevrons, swipe actions
  - `<Navbar>` — Top bar (title, left/right slots for icons)
  - `<Toolbar>` / `<Tabbar>` — Bottom navigation (links with icons)
  - `<Sheet>` / `<Popup>` — Sidebar drawer, modals, bulk action sheets
  - `<Button>` — Actions (large, rounded, fill, outline)
  - `<Preloader>` / `<Toast>` — Loading, success/error feedback
- Combine with Tailwind: Use Tailwind for custom spacing/colors, Konsta props for structure
- Icons: lucide-react inside Konsta slots (e.g., `<ListItem media={<HomeIcon/>}>`)
- Goal: Native Telegram feel — clean cards/lists with subtle shadows, no custom CSS for basic UI

(Then continue with your existing DESIGN STYLE and rest of the file unchanged)


## DESIGN STYLE

- Modern, **card-based**, professional admin dashboard.
- Mobile-first, optimized for **Telegram Mini App** (WebApp), but must also work in a normal browser for development.
- Consistent visual language with the customer mini app but more "dashboard" in density.
- Use:
  - **React + Vite + TypeScript**
  - **Tailwind CSS**
  - **lucide-react** for icons

High-level style rules:

- Light mode only for now (Tailwind-ready for future dark mode).
- Clear typography hierarchy (titles, subtitles, body).
- Cards with subtle shadows/borders and good spacing.
- Compact tables and lists for admin data.
- Keep screens simple: 2–3 primary actions per screen.

---

## GLOBAL LAYOUT

- **Bottom navigation (mobile)**:
  1. 🏠 Home (Dashboard)
  2. 📦 Inventory
  3. 🔄 Exchanges / Orders
  4. 💬 Inbox (optional initial version)

- **Header / top bar**:
  - Screen title
  - Optional filter/search controls
  - Simple menu icon (hamburger) for future sidebar (Settings, Activity Log, etc.)

- **Floating action button (optional)**:
  - For actions like "Add Phone", "Add Promotion" if needed later.

- **Sidebar menu (future-ready)**:
  - Triggered by hamburger icon
  - Slide-in from left
  - Initial items: Settings, Activity Log (room for legacy features later)

---

## HOME SCREEN – DASHBOARD

The **Home** screen is the primary admin dashboard. It should be mobile-first and show key metrics as **cards**.

Cards (priority order):

1. **Hot Leads / Key Activity** (Main section)
   - Total count of important leads or recent requests.
   - Optional ETB value summary (if detectable in current schema).
   - Realtime scrollable list of top 5–10 items (latest exchange requests, phone actions, hot inquiries).
   - Card layout example:🔥 HOT LEAD
@username or Phone
"Wants iPhone 15 Pro Max"
Budget: ~120,000 ETB (if available)
8 min ago
[Open / View]
- Tappable cards → open detail/chat
- Empty state: "No active hot leads right now"
- Use Convex subscription for realtime updates

### HOT LEADS SCORING RULES
Auto-rank leads by priority:
- 🔥🔥🔥 Exchange request + budget ≥80,000 ETB (top priority)
- 🔥🔥 Budget ≥80,000 ETB OR exchange request
- 🔥 Replied within 30 minutes OR specific phone model requested
- Regular: All other leads

Display top 10 hottest first. Update realtime via Convex subscription.
Empty state: "No hot leads right now - check Inbox for all activity"

2. **Orders / Exchanges Overview**
- Count of relevant orders/exchange requests.
- Basic status breakdown (e.g., new/pending/completed) if available.
- "View all" link or button to Orders/Exchanges screen.

3. **Inventory Summary**
- Count of active products.
- Optional breakdown (e.g., by category or status) if data is available.
- "View Inventory" button linking to Inventory screen.

4. **Today's Activity / Quick Stats**
- Small grid of metrics using existing Convex data:
- e.g., number of new actions, number of recent searches, etc.
- This should use data that already exists in the schema; do not add new tables.

Implementation notes:

- Use Convex queries/mutations already supported by the backend.
- If certain metrics aren't available yet, use placeholders and keep the card UI ready.

---

## ADMIN WORKFLOW PRIORITY

Dashboard cards must reflect admin urgency:

**Priority 1: Exchange Approvals** ⏱️
- Time-sensitive (customer waiting for valuation)
- High ETB value (70,000-150,000 ETB range)
- Action: Approve/reject with one tap

**Priority 2: Hot Leads** 💰
- Immediate revenue opportunity
- Sort by: score desc → createdAt desc
- Show wait time: "Waiting 3h" vs "Waiting 2 days"

**Priority 3: Inventory Problems** ⚠️
- Blacklisted IMEI detected
- iCloud lock warning
- Battery health <80% (flag for disclosure)

**Priority 4: Stats/Orders** 📊
- Informational only
- Collapsed by default (expand on tap)

---

## INVENTORY SCREEN

Screen: **Inventory / Phones**

Goal: Let admins browse and inspect phones/products using the current `products` table.

Elements:

- List or grid of product cards:
- Name / model
- Price (ETB, using existing `price` / `currency` fields)
- Status badge (e.g., active / draft / archived from current schema)
- Filters:
- Search by name/model.
- Filter by category or status if those fields exist.
- Actions (UI only for now; wire only if supported in backend):
- View details.
- Optional: quick status toggle or link to edit screen.

Use Convex to fetch products; no new schema fields should be added.

---

## ORDERS / EXCHANGES SCREEN

Screen: **Orders / Exchanges**

Goal: Use existing tables like `phoneActions` and `exchangeRequests` to show admin-relevant activity.

Elements:

- Tabs or filters:
- e.g., "Phone Actions", "Exchange Requests"
- For each item:
- Relevant fields from the current schema (sessionId, phoneId, requested model, status, createdAt, etc.).
- Simple detail view or modal (optional):
- Show core information and status.

Keep it simple and derive data only from the existing schema.

---

## INBOX / ACTIVITY SCREEN (OPTIONAL FIRST VERSION)

Screen: **Inbox / Activity**

Goal: Show a list of recent customer-related actions (based on current Convex data).

Elements:

- List of recent `phoneActions`, `searches`, or `exchangeRequests` (choose whichever is most useful).
- Simple row:
- Type (e.g., search / action / exchange)
- Short description
- Time

This can be minimal in the first version.

## BULK ACTIONS (Required for Admin Efficiency)

**Inbox/Exchanges screens must support:**
- Multi-select checkboxes (56px touch target on mobile)
- Bulk status change dropdown
- Bulk archive/close
- Selection counter: "5 items selected"

**Example workflow:**
1. Admin taps checkbox on 8 low-value leads
2. Dropdown appears: "Mark as Closed" | "Archive" | "Assign to..."
3. Confirm → Done (1 Convex mutation for all)

**Without bulk actions:** 8 taps = frustrated admin
**With bulk actions:** 1 tap = efficient operation

---

## TELEGRAM WEBAPP INTEGRATION (FRONTEND SIDE)

- Use `window.Telegram.WebApp`:
- Call `ready()` and `expand()` once the app is loaded.
- Safely read `initData` / `initDataUnsafe` if needed (frontend-only).
- The Admin app must still run in a normal browser without crashing:
- Always guard access to `window.Telegram`.

No backend auth changes here; structure code so backend auth can be added later if needed.

## OFFLINE/CONNECTIVITY HANDLING (Ethiopian Reality)

**Connection loss scenarios:**
- Admin loses signal mid-mutation
- Telegram app suspended/resumed
- Network timeout during inventory update

**Required behavior:**
- Show toast: "Connection lost - retrying..."
- Queue failed Convex mutations in localStorage
- Retry on reconnect (max 3 attempts)
- Clear success toast: "Synced ✓"

**UI indicators:**
- Offline badge in header (yellow dot + "Offline")
- Disable mutation buttons when offline
- Show last sync time: "Updated 2 min ago"

---

## IMPLEMENTATION ORDER (FRONTEND FOCUS)

1. Confirm React + Vite + TypeScript + Tailwind + lucide-react setup in `/tedytech-Admin-miniapp`.
2. Implement global layout (header, bottom navigation, sidebar stub, page structure).
3. Implement **Dashboard/Home** with priority on Hot Leads / Key Activity + other cards, using current Convex data.
4. Implement **Inventory** screen using `products` data.
5. Implement **Orders/Exchanges** screen using existing tables.
6. Optional: implement **Inbox/Activity** screen.
7. Polish layout for mobile-first use and Telegram Mini App embedding.

---

## FINAL RULES

- Respect the existing Convex schema: do not add new tables or fields unless explicitly requested.
- Keep design consistent with the customer mini app but in an admin/dashboard style.
- Use Tailwind and lucide-react consistently for all screens.
- All screens must be usable on small phone screens inside Telegram.
