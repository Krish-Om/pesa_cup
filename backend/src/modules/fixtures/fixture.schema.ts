import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { fixtures } from "../../db/schema";

export { fixtures };

export const insertFixtureSchema = createInsertSchema(fixtures, {
  homeTeamId: z.number().int().positive(),
  awayTeamId: z.number().int().positive(),
  tournamentId: z.number().int().positive(),
  venue: z.string().min(1).trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}(?:\s?[AP]M)?$/, "Time must be in HH:MM format"),
  status: z.enum(["upcoming", "live", "finished"]).default("upcoming"),
  scoreA: z.number().int().nonnegative().nullable().optional(),
  scoreB: z.number().int().nonnegative().nullable().optional(),
});

export const selectFixtureSchema = createSelectSchema(fixtures);
export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixturePayload = typeof fixtures.$inferInsert;
export type InsertFixtureInput = z.infer<typeof insertFixtureSchema>;
