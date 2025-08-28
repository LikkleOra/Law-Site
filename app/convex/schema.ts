import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // To store user data from Clerk
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(), // To link with Clerk user
    role: v.union(v.literal("lawyer"), v.literal("client")),
  }).index("by_clerk_id", ["clerkId"]),

  // Cases table
  cases: defineTable({
    caseNumber: v.string(),
    clientId: v.id("users"),
    lawyerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("closed"),
      v.literal("pending")
    ),
    documents: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(), // URL to the stored document
    }))),
    lawyerNotes: v.optional(v.string()),
  }).index("by_clientId", ["clientId"]).index("by_lawyerId", ["lawyerId"]),

  // Appointments table
  appointments: defineTable({
    clientId: v.id("users"),
    lawyerId: v.id("users"),
    dateTime: v.string(), // ISO 8601 format
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
  }).index("by_clientId", ["clientId"]).index("by_lawyerId", ["lawyerId"]),

  // Feedback table
  feedback: defineTable({
    clientId: v.id("users"),
    caseId: v.id("cases"),
    rating: v.number(), // e.g., 1-5
    comment: v.optional(v.string()),
  }).index("by_caseId", ["caseId"]),

  // Blog Posts table
  blogPosts: defineTable({
    title: v.string(),
    content: v.string(), // Markdown content
    author: v.string(),
    publishedDate: v.string(), // ISO 8601 format
  }),

  // Testimonials table
  testimonials: defineTable({
    clientId: v.id("users"),
    caseId: v.id("cases"),
    quote: v.string(),
    approved: v.boolean(),
  }),

  // Invoices table
  invoices: defineTable({
    caseId: v.id("cases"),
    amount: v.number(),
    dueDate: v.string(), // ISO 8601 format
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue")
    ),
    paymentLink: v.optional(v.string()),
  }).index("by_caseId", ["caseId"]),

  // Retainers table
  retainers: defineTable({
    clientId: v.id("users"),
    balance: v.number(),
    transactions: v.optional(v.array(v.object({
      date: v.string(),
      amount: v.number(),
      type: v.union(v.literal("deposit"), v.literal("withdrawal")),
    }))),
  }).index("by_clientId", ["clientId"]),
});
