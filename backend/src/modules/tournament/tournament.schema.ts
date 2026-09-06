import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tournaments } from "../../db/schema";

export { tournaments };

export const insertTournamentSchema = createInsertSchema(tournaments, {
  name: z.string().min(1, "Tournament name is required").trim(),
  slug: z
    .string()
    .min(1, "Tournament slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and hyphens",
    ),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).default("UPCOMING"),
  venue: z.string().nullable().optional(),
  organizer: z.string().nullable().optional(),
});

export const selectTournamentSchema = createSelectSchema(tournaments);
export type ZodInput = z.infer<typeof insertTournamentSchema>;
export type ZodReturnType = z.infer<typeof selectTournamentSchema>;
export type DBInput = typeof tournaments.$inferInsert;
export type DBReturnType = typeof tournaments.$inferSelect;
