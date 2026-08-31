import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ======================================================================
// 1. DRIZZLE SQLITE TABLE SCHEMA (Used by Drizzle-Kit & Database)
// ======================================================================
export const fixtures = sqliteTable('fixtures', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teamA: text('team_a').notNull(),
  teamB: text('team_b').notNull(),
  date: text('date').notNull(), // ISO date string e.g., "2026-06-15"
  time: text('time').notNull(), // e.g., "14:00"
  venue: text('venue').notNull(),
  status: text('status', { enum: ['upcoming', 'finished'] })
    .notNull()
    .default('upcoming'),
  scoreA: integer('score_a'), // Nullable by default when .notNull() is omitted
  scoreB: integer('score_b'),
});

// ======================================================================
// 2. AUTOMATIC ZOD SCHEMAS (Used by Controllers / Routes for Validation)
// ======================================================================

// For validating POST/PUT requests (inserts/updates)
export const insertFixtureSchema = createInsertSchema(fixtures, {
  teamA: z.string().min(1).trim(),
  teamB: z.string().min(1).trim(),
  venue: z.string().min(1).trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  status: z.enum(['upcoming', 'finished']).default('upcoming'),
  scoreA: z.number().int().nonnegative().nullable().optional(),
  scoreB: z.number().int().nonnegative().nullable().optional(),
});

// For API response payload typing
export const selectFixtureSchema = createSelectSchema(fixtures);

// ======================================================================
// 3. INFERRED TYPESCRIPT TYPES
// ======================================================================
export type Fixture = z.infer<typeof selectFixtureSchema>;
export type InsertFixturePayload = z.infer<typeof insertFixtureSchema>;