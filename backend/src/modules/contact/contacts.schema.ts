// src/modules/contact/contacts.schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status', { enum: ['new', 'read', 'archived'] })
      .notNull()
      .default('new'),
  createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
});

// ======================================================================
// ZOD SCHEMAS
// ======================================================================

// 1. Insert Schema (for POST requests)
export const insertContactSchema = createInsertSchema(contactMessages, {
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'), // Fixed: z.string().email()
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

// 2. Select Schema (for validated DB output)
export const selectContactSchema = createSelectSchema(contactMessages);

// ======================================================================
// TYPE EXPORTS
// ======================================================================

// DB Record Type (Out of DB)
export type ContactMessage = typeof contactMessages.$inferSelect;

// DB Insert Payload Type (Into DB)
export type InsertContactPayload = typeof contactMessages.$inferInsert;

// API Request Body Payload Type (From Client)
export type InsertContactInput = z.infer<typeof insertContactSchema>;