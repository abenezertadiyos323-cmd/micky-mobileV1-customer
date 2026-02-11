import { query } from "./_generated/server";

// Return all products from the Convex `products` table.
export const listAllProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});
