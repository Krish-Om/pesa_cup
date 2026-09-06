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

  // Payment receipt — relative path returned by POST /registrations/upload-receipt
  // e.g. /uploads/receipts/receipt-1725518232-483920183.jpg
  paymentReceiptUrl: z.string().min(1, "Payment receipt is required"),
  // Optional manual transaction reference
  transactionCode: z.string().trim().optional().nullable(),

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

export const rejectRegistrationSchema = z.object({
  rejectionReason: z.string().trim().min(1).optional(),
});

export type Registration = typeof registrations.$inferSelect;
export type RegistrationInput = z.infer<typeof insertRegistrationSchema>;
export type RegistrationPayload = typeof registrations.$inferInsert;
