import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { registrations } from "../../db/schema";

export { registrations };

export const insertRegistrationSchema = createInsertSchema(registrations, {
  tournamentId: z.number().int().positive("Invalid tournament ID"),
  teamName: z.string().min(1, "Team name is required").trim(),
  captainName: z.string().min(1, "Captain name is required").trim(),
  captainEmail: z.string().email("Invalid captain email address").trim(),
  captainPhone: z.string().min(10, "Valid phone number is required").trim(),
  playerCount: z.number().int().positive("Player count must be greater than 0"),
  batchYear: z.string().min(1, "Batch/Graduation year is required").trim(),

  // Payment Validation
  paymentMethod: z.enum(["ESEWA", "MANUAL", "CASH"]).default("ESEWA"),
  transactionUuid: z.string().min(1, "Transaction UUID is required"),
  transactionCode: z.string().nullable().optional(),
  amountPaid: z.number().int().positive("Amount paid must be greater than 0"),
  paymentReceiptUrl: z.string().url().nullable().optional(),

  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  rejectionReason: z.string().nullable().optional(),
  teamId: z.number().int().positive().nullable().optional(),
});

export const selectRegistrationSchema = createSelectSchema(registrations);

export const approveRegistrationSchema = z.object({
  group: z
    .string()
    .min(1, "Group name cannot be empty")
    .trim()
    .default("Group A"),
});

export const registrationDetailsSchema = z.object({
  tournamentId: z.number().int().positive("Invalid tournament ID"),
  teamName: z.string().min(1, "Team name is required").trim(),
  captainName: z.string().min(1, "Captain name is required").trim(),
  captainEmail: z.string().email("Invalid captain email address").trim(),
  captainPhone: z.string().min(10, "Valid phone number is required").trim(),
  playerCount: z.number().int().positive("Player count must be greater than 0"),
  batchYear: z.string().min(1, "Batch/Graduation year is required").trim(),
});

export const verifyPaymentSchema = registrationDetailsSchema.extend({
  encodedResponse: z.string().min(1, "Payment response is required"),
});

export type Registration = typeof registrations.$inferSelect;
export type RegistrationInput = z.infer<typeof insertRegistrationSchema>;
export type RegistrationPayload = typeof registrations.$inferInsert;
