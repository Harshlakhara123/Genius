import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  // Define expected arguments
  args: {
    email: v.string(),
    plan: v.string(),
    maxCredits: v.number(),
  },

  // The main logic
  async handler(ctx, args) {
    // Check if the user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      // Optional: you can just return existing user or throw error
      return existingUser;
    }

    // Create a new user entry
    const newUser = await ctx.db.insert("users", {
      email: args.email,
      plan: args.plan,
      creditUsed: 0,
      maxCredits: args.maxCredits,
    });

    return newUser;
  },
});