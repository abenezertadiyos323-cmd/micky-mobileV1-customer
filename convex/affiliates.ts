import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAffiliateByCustomerId = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    const customerId = args.customerId.trim();
    if (!customerId) return null;

    try {
      const a = await ctx.db
        .query("affiliates")
        .filter((q) => q.eq(q.field("customerId"), customerId))
        .order("createdAt", "desc")
        .first();
      return a ?? null;
    } catch {
      return null;
    }
  },
});

export const listAffiliateCommissions = query({
  args: { affiliateId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("affiliateCommissions")
      .filter((q) => q.eq(q.field("affiliateId"), args.affiliateId))
      .order("createdAt", "desc")
      .collect();
  },
});

export const createAffiliateIfNotExists = mutation({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("affiliates")
      .filter((q) => q.eq(q.field("customerId"), args.customerId))
      .first();
    if (existing) return existing._id;

    const code = `REF${Date.now().toString().slice(-6)}`;
    const id = await ctx.db.insert("affiliates", {
      customerId: args.customerId,
      referralCode: code,
      createdAt: Date.now(),
    });
    return id;
  },
});
