import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const checkApiLimit = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) {
            return false;
        }

        if (user.plan === "free" && user.creditUsed >= 5) {
            return false;
        }

        return true;
    },
});

export const increaseApiLimit = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) {
            return;
        }

        await ctx.db.patch(user._id, {
            creditUsed: user.creditUsed + 1,
        });
    },
});

export const getApiLimitCount = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) {
            return 0;
        }

        return user.creditUsed;
    }
});
