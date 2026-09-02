import express from "express";
import contactsController from "./contacts.controller.ts";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";

const contacts = express.Router();

contacts.post(
  "/",
  contactFormLimiter,
  asyncHandler(contactsController.createContact),
);
contacts.get("/", apiReadLimiter, asyncHandler(contactsController.getContacts));

export default contacts;
