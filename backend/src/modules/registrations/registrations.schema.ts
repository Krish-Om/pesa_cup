import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { registrations } from "../../db/schema";

export { registrations };

export const insertRegistrationSchema = createInsertSchema(registrations, {
  tournamentId: z.number().int().positive(),
  teamName: z.string().min(1, "Team name is required").trim(),
  captainName: z.string().min(1, "Captain name is required").trim(),
  captainEmail: z.email("Invalid captain email address"),
  captainPhone: z.string().min(1, "Captain phone is required").trim(),
  playerCount: z.number().int().positive(),
  paymentReceiptUrl: z.string().url().nullable().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  rejectionReason: z.string().nullable().optional(),
  teamId: z.number().int().positive().nullable().optional(),
});

export const selectRegistrationSchema = createSelectSchema(registrations);
export const approveRegistrationSchema = z.object({
  group: z.string().min(1).trim().default("Group A"),
});

export type Registration = typeof registrations.$inferSelect;
export type RegistrationInput = z.infer<typeof insertRegistrationSchema>;
export type RegistrationPayload = typeof registrations.$inferInsert;
