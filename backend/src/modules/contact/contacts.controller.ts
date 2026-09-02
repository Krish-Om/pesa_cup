import { type Request, type Response } from "express";
import { contactService } from "./contacts.service";

const contactsController = {
  getContacts: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(await contactService.getContacts());
  },
  createContact: async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await contactService.createContacts(req.body));
  },
};

export default contactsController;
