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
// FIXED ZOD SCHEMA DEFINITION
// ======================================================================
export const insertContactSchema = createInsertSchema(contactMessages, {
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  status: z.enum(['new', 'read', 'archived']).default('new'),
});

export const selectContactSchema = createSelectSchema(contactMessages);

export type ContactMessage = z.infer<typeof selectContactSchema>;
export type InsertContactPayload = z.infer<typeof insertContactSchema>;