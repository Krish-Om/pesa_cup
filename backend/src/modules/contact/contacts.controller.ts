import {type Request, type Response} from "express";
import contactService from "./contacts.service.ts";

export class ContactsController {
    async createContact(req: Request, res: Response) {
        try {
            const {name, email, subject, message} = req.body;
            if (!name || !email || !subject || !message) {
                return res.status(400).json({error: "All fields are required"});
            }
            const newContactMessage = {name, email, subject, message, status: "new" as const};
            const newContact = await contactService.createContact(newContactMessage);
            res.status(201).json(newContact);
        } catch (error) {
            req.log.error("Error creating contact message: " + error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
}

const contactController = new ContactsController();
export default contactController;