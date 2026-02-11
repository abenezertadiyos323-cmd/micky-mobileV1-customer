import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPhoneActionRequest = mutation({
  args: {
    sessionId: v.string(),
    phoneId: v.string(),
    variantId: v.optional(v.string()),
    actionType: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("phoneActions", {
      sessionId: args.sessionId,
      phoneId: args.phoneId,
      variantId: args.variantId ?? null,
      actionType: args.actionType,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const createExchangeRequestMiniapp = mutation({
  args: {
    sessionId: v.string(),
    desiredPhoneId: v.string(),
    offeredModel: v.string(),
    offeredStorageGb: v.number(),
    offeredCondition: v.string(),
    offeredNotes: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("exchangeRequests", {
      sessionId: args.sessionId,
      desiredPhoneId: args.desiredPhoneId,
      offeredModel: args.offeredModel,
      offeredStorageGb: args.offeredStorageGb,
      offeredCondition: args.offeredCondition,
      offeredNotes: args.offeredNotes,
      status: "new",
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getExchangeRequestsV2 = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exchangeRequests")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .order("createdAt", "desc")
      .collect();
  },
});

// Admin: list all phone actions with product name/price joined
export const listAllPhoneActions = query({
  handler: async (ctx) => {
    const actions = await ctx.db.query("phoneActions").order("desc").collect();
    const enriched = await Promise.all(
      actions.map(async (a) => {
        let phoneName: string | null = null;
        let phonePrice: number | null = null;
        try {
          const product = await ctx.db.get(a.phoneId as any);
          if (product) {
            phoneName = (product as any).name ?? null;
            phonePrice = (product as any).price ?? null;
          }
        } catch {
          // phoneId may not be a valid product ID
        }
        return { ...a, phoneName, phonePrice };
      })
    );
    return enriched;
  },
});

// Admin: list all exchange requests with desired phone name/price joined
export const listAllExchangeRequests = query({
  handler: async (ctx) => {
    const requests = await ctx.db.query("exchangeRequests").order("desc").collect();
    const enriched = await Promise.all(
      requests.map(async (r) => {
        let desiredPhoneName: string | null = null;
        let desiredPhonePrice: number | null = null;
        try {
          const product = await ctx.db.get(r.desiredPhoneId as any);
          if (product) {
            desiredPhoneName = (product as any).name ?? null;
            desiredPhonePrice = (product as any).price ?? null;
          }
        } catch {
          // desiredPhoneId may not be a valid product ID
        }
        return { ...r, desiredPhoneName, desiredPhonePrice };
      })
    );
    return enriched;
  },
});

// Admin: update exchange request status
export const updateExchangeStatus = mutation({
  args: {
    requestId: v.id("exchangeRequests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, { status: args.status });
  },
});

export const getExchangeDetailV2 = query({
  args: { requestId: v.id("exchangeRequests"), sessionId: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get("exchangeRequests", args.requestId);
    if (!doc) return {};
    if (doc.sessionId !== args.sessionId) return {};
    return {
      request: doc,
      images: [],
    };
  },
});
