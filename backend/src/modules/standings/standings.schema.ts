import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { standings } from "../../db/schema";

export { standings };

export const insertStandingSchema = createInsertSchema(standings, {
  teamId: z.number().int().positive(),
  tournamentId: z.number().int().positive(),
  group: z.string().min(1, "Group is required").trim(),
  played: z.number().int().nonnegative().default(0),
  won: z.number().int().nonnegative().default(0),
  draw: z.number().int().nonnegative().default(0),
  lost: z.number().int().nonnegative().default(0),
  goalFor: z.number().int().nonnegative().default(0),
  goalAgainst: z.number().int().nonnegative().default(0),
  goalDifference: z.number().int().default(0),
  points: z.number().int().nonnegative().default(0),
  position: z.number().int().positive().nullable().optional(),
});

export const selectStandingSchema = createSelectSchema(standings);
export type ZodInput = z.infer<typeof insertStandingSchema>;
export type ZodReturnType = z.infer<typeof selectStandingSchema>;
export type DBInput = typeof standings.$inferInsert;
export type DBReturnType = typeof standings.$inferSelect;
export type Standing = ZodReturnType;
export type Standings = DBReturnType;
export type InsertStandingInput = ZodInput;
export type InsertStandingPayload = DBInput;
