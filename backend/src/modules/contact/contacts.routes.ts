import express from "express";
import contactsController from "./contacts.controller.ts";
import { asyncHandler } from "../../middlewares/error-handler";
import { contactFormLimiter } from "../../middlewares/rate-limiter.ts";

const contacts = express.Router();

contacts.post("/", contactFormLimiter, asyncHandler(contactsController.createContact));
contacts.get("/", asyncHandler(contactsController.getContacts));

export default contacts;
