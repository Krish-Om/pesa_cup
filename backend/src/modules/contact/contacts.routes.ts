import express from "express";
import contactsController from "./contacts.controller.ts";

const contacts = express.Router();

contacts.post("/", contactsController.createContact);
contacts.get("/", contactsController.getContacts);

export default contacts;