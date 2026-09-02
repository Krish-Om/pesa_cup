import { type Request, type Response } from "express";
import { contactService } from "./contacts.service";

const contactsController = {
  getContacts: async (req: Request, res: Response): Promise<void> => {
    const result = await contactService.getContacts();
    res.status(200).json(result);
  },
  createContact: async (req: Request, res: Response): Promise<void> => {
    const result = await contactService.createContacts(req.body);
    res.status(201).json(result);
  },
};

export default contactsController;
