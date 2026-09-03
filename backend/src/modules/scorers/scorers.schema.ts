import { z } from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { tournaments } from "../tournament/tournament.schema";

//1. Table schema

export const scorers = sqliteTable("scorers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerName: text("player_name").notNull(),
  teamName: text("team_name").notNull(),
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  rank: integer("rank"),
  avatar: text("avatar"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 2. Automatic Zod Schemas for Validations
// For API request validation (POST / PUT)
export const insertScorerSchema = createInsertSchema(scorers, {
  playerName: z.string().min(1, "Player name is required").trim(),
  teamName: z.string().min(1, "Team name is required").trim(),
  goals: z.number().int().nonnegative().default(0),
  assists: z.number().int().nonnegative().default(0),
  rank: z.number().int().positive().nullable().optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
});

// For API response payload validation
export const selectScorerSchema = createSelectSchema(scorers);

// 3. INFERRED TYPESCRIPT TYPES
export type ZodInput = z.infer<typeof insertScorerSchema>;
export type ZodReturnType = z.infer<typeof selectScorerSchema>;
export type DBInput = typeof scorers.$inferInsert;
export type DBReturnType = typeof scorers.$inferSelect;

export type Scorer = DBReturnType;
export type InsertScorerPayload = DBInput;
