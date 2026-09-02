import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ======================================================================
// 1. DRIZZLE SQLITE TABLE SCHEMA
// ======================================================================
export const standings = sqliteTable("standings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  team: text("team").notNull(),
  group: text("group").notNull(),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  draw: integer("draw").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  goalFor: integer("goal_for").notNull().default(0),
  goalAgainst: integer("goal_against").notNull().default(0),
  goalDifference: integer("goal_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  position: integer("position"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ======================================================================
// 2. AUTOMATIC ZOD SCHEMAS
// ======================================================================

// For API request validation (POST / PUT)
export const insertStandingSchema = createInsertSchema(standings, {
  team: z.string().min(1, "Team name is required").trim(),
  group: z.string().min(1, "Group is required").trim(),
  played: z.number().int().nonnegative().default(0),
  won: z.number().int().nonnegative().default(0),
  draw: z.number().int().nonnegative().default(0),
  lost: z.number().int().nonnegative().default(0),
  goalFor: z.number().int().nonnegative().default(0),
  goalAgainst: z.number().int().nonnegative().default(0),
  goalDifference: z.number().int().default(0),
  points: z.number().int().nonnegative().default(0),
  position: z.number().int().positive().optional(),
});

// For API response payload validation
export const selectStandingSchema = createSelectSchema(standings);

// ======================================================================
// 3. INFERRED TYPESCRIPT TYPES
// ======================================================================
export type ZodInput = z.infer<typeof insertStandingSchema>;
export type ZodReturnType = z.infer<typeof selectStandingSchema>;
export type DBInput = typeof standings.$inferInsert;
export type DBReturnType = typeof standings.$inferSelect;

export type Standing = ZodReturnType;
export type Standings = DBReturnType;
export type InsertStandingInput = ZodInput;
export type InsertStandingPayload = DBInput;
