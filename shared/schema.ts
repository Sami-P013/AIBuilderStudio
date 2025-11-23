import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table - stores user's AI-generated projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'website', 'webapp', 'chatbot', 'ai-agent'
  code: text("code").notNull(),
  language: text("language").notNull().default('html'), // 'html', 'javascript', 'python', etc.
  prompt: text("prompt"), // Original AI prompt used
  techStack: text("tech_stack").array().notNull().default(sql`ARRAY[]::text[]`),
  githubRepo: text("github_repo"), // URL to synced GitHub repo
  lastModified: timestamp("last_modified").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  lastModified: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Templates - pre-built starter templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'landing', 'saas', 'blog', 'ecommerce', 'chatbot', 'ai-agent'
  code: text("code").notNull(),
  language: text("language").notNull().default('html'),
  techStack: text("tech_stack").array().notNull().default(sql`ARRAY[]::text[]`),
  thumbnail: text("thumbnail"), // URL or path to thumbnail image
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
