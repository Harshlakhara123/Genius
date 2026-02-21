import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        plan: v.string(),
        creditUsed: v.number(),
        maxCredits: v.number(),
    }).index("by_email", ["email"]),
})