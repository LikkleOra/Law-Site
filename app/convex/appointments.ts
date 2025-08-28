import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAppointment = mutation({
  args: {
    lawyerId: v.id("users"),
    dateTime: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.insert("appointments", {
      clientId: user._id,
      lawyerId: args.lawyerId,
      dateTime: args.dateTime,
      status: "scheduled",
      notes: args.notes,
    });
  },
});

export const getAppointmentsForCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    if (user.role === "client") {
      return await ctx.db
        .query("appointments")
        .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
        .collect();
    }

    if (user.role === "lawyer") {
      return await ctx.db
        .query("appointments")
        .withIndex("by_lawyerId", (q) => q.eq("lawyerId", user._id))
        .collect();
    }

    return [];
  },
});
