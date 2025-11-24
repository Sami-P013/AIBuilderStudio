import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
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
  modelUsed: text("model_used").default('openai-gpt4'), // Track which model was used
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

// Model Configuration table - stores user's selected models and connectors
export const modelConfigs = pgTable("model_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 'openai', 'claude', 'gemini', 'groq', 'custom'
  provider: text("provider").notNull(), // 'openai', 'anthropic', 'google', 'openrouter', 'custom'
  modelId: text("model_id").notNull(), // 'gpt-4', 'claude-3-opus', 'gemini-2.5-pro', etc
  displayName: text("display_name").notNull(), // User-friendly name
  isActive: boolean("is_active").default(false).notNull(),
  apiKey: text("api_key"), // Optional API key if using own credentials
  config: jsonb("config").default(sql`'{}'::jsonb`), // Extra config like temperature, max_tokens, etc
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertModelConfigSchema = createInsertSchema(modelConfigs).omit({
  id: true,
  createdAt: true,
});

export type InsertModelConfig = z.infer<typeof insertModelConfigSchema>;
export type ModelConfig = typeof modelConfigs.$inferSelect;

// MCP Server Configuration table - stores user's MCP (Model Context Protocol) servers
export const mcpServers = pgTable("mcp_servers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // User-defined name
  type: text("type").notNull(), // 'stdio', 'sse', 'custom'
  command: text("command"), // For stdio MCPs: the command to execute
  url: text("url"), // For SSE MCPs: the server URL
  isActive: boolean("is_active").default(false).notNull(),
  config: jsonb("config").default(sql`'{}'::jsonb`), // Extra config parameters
  capabilities: text("capabilities").array().default(sql`ARRAY[]::text[]`), // List of tool names/capabilities
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMCPServerSchema = createInsertSchema(mcpServers).omit({
  id: true,
  createdAt: true,
});

export type InsertMCPServer = z.infer<typeof insertMCPServerSchema>;
export type MCPServer = typeof mcpServers.$inferSelect;

// Library Configuration table - stores user's integrated libraries and tools
export const libraryConfigs = pgTable("library_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Library name
  type: text("type").notNull(), // 'npm-package', 'python-package', 'api', 'service'
  packageName: text("package_name"), // For packages: the actual package name
  version: text("version"), // Package version or API version
  isActive: boolean("is_active").default(false).notNull(),
  config: jsonb("config").default(sql`'{}'::jsonb`), // API keys, auth tokens, settings
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLibraryConfigSchema = createInsertSchema(libraryConfigs).omit({
  id: true,
  createdAt: true,
});

export type InsertLibraryConfig = z.infer<typeof insertLibraryConfigSchema>;
export type LibraryConfig = typeof libraryConfigs.$inferSelect;
