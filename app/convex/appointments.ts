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

import { QueryCtx } from "convex/server";
import { Id } from "./_generated/dataModel";

async function _getAppointmentsForClient(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("appointments")
    .withIndex("by_clientId", (q) => q.eq("clientId", userId))
    .collect();
}

async function _getAppointmentsForLawyer(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("appointments")
    .withIndex("by_lawyerId", (q) => q.eq("lawyerId", userId))
    .collect();
}

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
      return _getAppointmentsForClient(ctx, user._id);
    }

    if (user.role === "lawyer") {
      return _getAppointmentsForLawyer(ctx, user._id);
    }

    return [];
  },
});
