import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { scorers } from "../../db/schema";

export { scorers };

export const insertScorerSchema = createInsertSchema(scorers, {
  playerName: z.string().min(1, "Player name is required").trim(),
  teamId: z.number().int().positive(),
  tournamentId: z.number().int().positive(),
  goals: z.number().int().nonnegative().default(0),
  assists: z.number().int().nonnegative().default(0),
  rank: z.number().int().positive().nullable().optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
});

export const selectScorerSchema = createSelectSchema(scorers);
export type ZodInput = z.infer<typeof insertScorerSchema>;
export type ZodReturnType = z.infer<typeof selectScorerSchema>;
export type DBInput = typeof scorers.$inferInsert;
export type DBReturnType = typeof scorers.$inferSelect;
export type Scorer = DBReturnType;
export type InsertScorerPayload = DBInput;
