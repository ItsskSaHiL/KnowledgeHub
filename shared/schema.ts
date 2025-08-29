import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const domains = pgTable("domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  progress: integer("progress").notNull().default(0),
  articlesCount: integer("articles_count").notNull().default(0),
  projectsCount: integer("projects_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  domainId: varchar("domain_id").notNull().references(() => domains.id),
  status: text("status").notNull().default("draft"), // draft, in-progress, published
  tags: json("tags").$type<string[]>().notNull().default([]),
  attachments: json("attachments").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  domainId: varchar("domain_id").notNull().references(() => domains.id),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  status: text("status").notNull().default("draft"), // draft, in-progress, completed
  tags: json("tags").$type<string[]>().notNull().default([]),
  technologies: json("technologies").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Domain = typeof domains.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Project = typeof projects.$inferSelect;
