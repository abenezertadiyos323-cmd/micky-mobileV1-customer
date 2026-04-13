# Convex Deployment Rules

## Deployments

Customer mini app now shares the **Admin MASTER** Convex project. There is a single project
with two environments:

| Name | URL | Purpose |
|------|-----|---------|
| **Production (MASTER)** | **`https://fastidious-schnauzer-265.convex.cloud`** | Live app (Admin + Customer) |
| Dev (MASTER) | `https://dutiful-toucan-720.convex.cloud` | Local development (Admin + Customer) |

> **OLD deployments retired:**
> - `clever-partridge-181.convex.cloud` — old customer-only prod, no longer used
> - `original-ram-766.convex.cloud` — old customer-only dev, no longer used

---

## How the CLI decides where to deploy

Convex functions live in `d:\Abenier\Micky Mobile Admin\Admin-Ted\convex\` (the MASTER repo).
Always run Convex CLI commands from that directory:

```
# Admin-Ted repo: d:\Abenier\Micky Mobile Admin\Admin-Ted
CONVEX_DEPLOYMENT=dev:dutiful-toucan-720
```

- `npx convex dev` → syncs to the **dev** deployment (`dutiful-toucan-720`).
- `npx convex deploy --yes` → deploys to **production** (`fastidious-schnauzer-265`).

**Never run `npx convex deploy` from the customer repo** — the customer repo has no `convex/`
functions of its own. It only consumes the generated types from Admin-Ted.

---

## Rules

### Fixing a production bug

```bash
# From Admin-Ted repo: d:\Abenier\Micky Mobile Admin\Admin-Ted
npx convex deploy --yes
```

This atomically pushes schema + all functions to `fastidious-schnauzer-265`.

### Local development

```bash
npx convex dev
```

Watches `convex/` and hot-reloads to `dutiful-toucan-720`. Safe to use freely — never touches production.

---

## Frontend URLs must match production

Both apps must point to the same MASTER deployment. Never split them:

| App | File | Required value |
|-----|------|----------------|
| Customer | `micky-mobile-miniapp/customer-app/.env.production` | `VITE_CONVEX_URL=https://fastidious-schnauzer-265.convex.cloud` |
| Customer (local) | `micky-mobile-miniapp/customer-app/.env.local` | `VITE_CONVEX_URL=https://fastidious-schnauzer-265.convex.cloud` |
| Admin | `Admin-Ted/.env.production` / Vercel env var | `VITE_CONVEX_URL=https://fastidious-schnauzer-265.convex.cloud` |

---

## Syncing generated types to customer app

The customer app reads Convex types from Admin-Ted's `_generated` directory via a prebuild script:

```bash
# customer-app/scripts/syncConvexGenerated.mjs
# Primary source: d:\Abenier\Micky Mobile Admin\Admin-Ted\convex\_generated
# Destination:    customer-app/src/convex_generated/
```

Run before building: `node scripts/syncConvexGenerated.mjs`
The `prebuild` npm script does this automatically.

---

## Post-deploy verification

After every `npx convex deploy --yes`:

1. **Dashboard** → [dashboard.convex.dev](https://dashboard.convex.dev) → project `Admin-Ted` → switch to **Production** environment.
2. **Functions tab** → confirm the updated functions appear with a recent deploy timestamp.
3. **Data tab** → check any modified table's Indexes sub-tab to confirm new indexes are present.
4. **Logs tab** → open the app and watch for `Error` status on any function — there should be none.
