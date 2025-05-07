import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keep the existing table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Content table (for storing generated content)
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  topic: text("topic").notNull(),
  communicationStyle: varchar("communication_style", { length: 50 }).notNull(),
  content: text("content").notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
});

export const contentGenerationSchema = z.object({
  contentType: z.string(),
  platform: z.string(),
  topic: z.string(),
  communicationStyle: z.string(),
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type ContentItem = typeof contentItems.$inferSelect;
export type ContentGeneration = z.infer<typeof contentGenerationSchema>;
