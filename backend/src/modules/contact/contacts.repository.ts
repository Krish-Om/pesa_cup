import { dbSession } from "../../config/database";
import { contactMessages, type ContactMessage, type InsertContactPayload } from "./contacts.schema";


export class ContactsRepository {
    async createContact(data: InsertContactPayload): Promise<ContactMessage> {
        const [inserted] = await dbSession.insert(contactMessages).values(data).returning();
        if (!inserted) throw new Error("Failed to insert contact message.");
        return inserted;
    }

    async getAllContacts(): Promise<ContactMessage[]> {
        return dbSession.select().from(contactMessages).all();
    }

}

export const contactsRepository = new ContactsRepository();