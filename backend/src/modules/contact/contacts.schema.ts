import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { contactMessages } from "../../db/schema";

export { contactMessages };

export const insertContactSchema = createInsertSchema(contactMessages, {
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const selectContactSchema = createSelectSchema(contactMessages);
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactPayload = typeof contactMessages.$inferInsert;
export type InsertContactInput = z.infer<typeof insertContactSchema>;
