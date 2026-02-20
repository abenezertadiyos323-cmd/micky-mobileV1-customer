import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAffiliateByCustomerId = query({
  args: { customerId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const customerId = args.customerId?.trim();
    if (!customerId) return null;

    const a = await ctx.db
      .query("affiliates")
      .withIndex("by_customerId", (q) => q.eq("customerId", customerId))
      .order("desc")
      .first();
    return a ?? null;
  },
});

export const listAffiliateCommissions = query({
  args: { affiliateId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("affiliateCommissions")
      .withIndex("by_affiliateId", (q) => q.eq("affiliateId", args.affiliateId))
      .order("desc")
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
