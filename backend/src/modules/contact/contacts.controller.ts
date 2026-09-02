import {type Request, type Response} from "express";
import {contactService} from "./contacts.service";
import {ZodError} from "zod";

const contactsController = {
    getContacts: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await contactService.getContacts();
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },
    createContact: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await contactService.createContacts(req.body);
            res.status(201).json(result);
        } catch (err: any) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: "Validation Failed", details: err.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    }))
                })
                return;
            }
            res.status(500).json({error: err.message || "Failed to create contact message."});
        }
    }
}

export default contactsController;