import {z} from "zod";
import dbSession from "../../config/database.ts";
import contactSchema from "./contacts.schema.ts";

type ContactMessage = z.infer<typeof contactSchema>;

export class ContactsRepository {
    async createContact(data: Omit<ContactMessage, "id" | "createdAt">): Promise<ContactMessage> {
        const result = await dbSession.execute(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            [data.name, data.email, data.subject, data.message]
        );
        return {
            id: result as number,
            ...data,
            createdAt: new Date(),
        };
    }
}

const contactRepository = new ContactsRepository();
export default contactRepository;