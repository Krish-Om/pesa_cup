import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

//1. Table schema

export const scorers = sqliteTable("scorers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  team: text("team").notNull(),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  rank: integer("rank"),
  avatar: text("avatar"),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 2. Automatic Zod Schemas for Validations
// For API request validation (POST / PUT)
export const insertScorerSchema = createInsertSchema(scorers, {
  name: z.string().min(1, "Name is required").trim(),
  team: z.string().min(1, "Team name is required").trim(),
  goals: z.number().int().nonnegative().default(0),
  assists: z.number().int().nonnegative().default(0),
  rank: z.number().int().positive().nullable().optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
});

// For API response payload validation
export const selectScorerSchema = createSelectSchema(scorers);

// 3. INFERRED TYPESCRIPT TYPES
export type Scorer = z.infer<typeof selectScorerSchema>;
export type InsertScorerPayload = z.infer<typeof insertScorerSchema>;
