import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCasesForCurrentUser = query({
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

    return await ctx.db
      .query("cases")
      .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
      .collect();
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveDocument = mutation({
  args: {
    caseId: v.id("cases"),
    storageId: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const caseRecord = await ctx.db.get(args.caseId);
    if (!caseRecord) {
      throw new Error("Case not found");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
        throw new Error("Url not found for storage id");
    }

    const documents = caseRecord.documents ?? [];
    documents.push({ name: args.fileName, url });

    await ctx.db.patch(args.caseId, { documents });
  },
});
