import {
  type ContactMessage,
  type InsertContactInput,
  type InsertContactPayload,
  insertContactSchema,
} from "./contacts.schema";
import { ContactsRepository, contactsRepository } from "./contacts.repository";
import { z, ZodError } from "zod";
import { logger } from "../../utils/logger.ts";

export class ContactsService {
  constructor(private readonly repo: ContactsRepository = contactsRepository) {}

  async getContacts(): Promise<ContactMessage[]> {
    let result: ContactMessage[] = [];
    try {
      logger.debug("Fetching all contacts...");
      const data = await this.repo.getAllContacts();
      result = (data ?? []) as ContactMessage[];
    } catch (err) {
      logger.error({ err, contacts: [] }, "Failed to retrieve all contacts.");
      throw err;
    }
    if (result.length === 0) {
      logger.info({ count: 0 }, "No Contacts found.");
      return [];
    }
    logger.info(
      { count: result.length },
      `Found ${result.length} contacts....`,
    );
    return result;
  }

  async createContacts(payload: InsertContactPayload): Promise<ContactMessage> {
    logger.debug("Creating new contacts...");
    let result: ContactMessage | null = null;
    try {
      const validatedPayload = insertContactSchema.parse(payload);
      const data = await this.repo.createContact(validatedPayload);
      result = (data ?? null) as ContactMessage | null;
    } catch (err) {
      logger.error({ err, contacts: payload }, "Failed to create contacts.");
      throw err;
    }
    if (!result) {
      logger.warn(
        { payload },
        `Repository returned empty result when creating new contacts.`,
      );
      throw new Error("Failed to create contacts.");
    }
    logger.info({ contactId: result.id }, "New contact created successfully");
    return result;
  }
}
export const contactService = new ContactsService();
