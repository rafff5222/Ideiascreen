import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (updated with more fields)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  profileImageUrl: text("profile_image_url"),
  planType: varchar("plan_type", { length: 50 }).default("free").notNull(),
  requestsUsed: integer("requests_used").default(0).notNull(),
  requestsLimit: integer("requests_limit").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  emailVerified: integer("email_verified").default(0).notNull(), // Use integer instead of boolean (0 = false, 1 = true)
});

// Define schemas using zod directly
export const registerUserSchema = z.object({
  username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
});

export const loginUserSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

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

export const contentGenerationSchema = z.object({
  contentType: z.string(),
  platform: z.string(),
  topic: z.string(),
  communicationStyle: z.string(),
});

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContent = typeof contentItems.$inferInsert;
export type ContentGeneration = z.infer<typeof contentGenerationSchema>;