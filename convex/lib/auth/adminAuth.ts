// Use broad types here to avoid tight coupling with generated types in this workspace
type QueryCtx = any;
type MutationCtx = any;
type Id<T = any> = any;

/**
 * Admin authentication helpers for custom Convex-based auth
 * Multi-tenant ownership verification
 *
 * Auth flow:
 * 1. Admin authenticates via Telegram (telegramId is canonical identity)
 * 2. Session created with token
 * 3. Token passed in all admin mutations for verification
 */

export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  const session = await ctx.db
    .query("admin_sessions")
    .withIndex("by_token", (q: any) => (q as any).eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Unauthorized: Invalid or expired session");
  }

  const seller = await ctx.db.get(session.sellerId);
  if (!seller || !seller.isActive) {
    throw new Error("Unauthorized: Seller account inactive");
  }

  return { sellerId: seller._id, role: seller.role };
}

export async function requireOwnership(
  ctx: any,
  documentId: any,
  adminSellerId: any,
) {
  const doc = await ctx.db.get(documentId);
  if (!doc) {
    throw new Error("Document not found");
  }

  if (doc.sellerId !== adminSellerId) {
    throw new Error("Unauthorized: Document belongs to different seller");
  }

  return doc;
}

/**
 * Generate a secure random token for session management
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Calculate session expiration (7 days from now)
 */
export function getSessionExpiration(): number {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  return Date.now() + SEVEN_DAYS_MS;
}
