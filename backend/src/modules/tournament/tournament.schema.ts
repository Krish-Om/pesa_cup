import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tournaments = sqliteTable("tournaments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status", { enum: ["UPCOMING", "ONGOING", "COMPLETED"] })
    .notNull()
    .default("UPCOMING"),
  venue: text("venue"),
  organizer: text("organizer"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

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
  venue: z.string().optional(),
  organizer: z.string().optional(),
});

export const selectTournamentSchema = createSelectSchema(tournaments);
export type ZodInput = z.infer<typeof insertTournamentSchema>;
export type ZodReturnType = z.infer<typeof selectTournamentSchema>;
export type DBInput = typeof tournaments.$inferInsert;
export type DBReturnType = typeof tournaments.$inferSelect;
