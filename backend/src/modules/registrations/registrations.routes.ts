import express from "express";
import { asyncHandler } from "../../middlewares/error-handler";
import { requireAdmin } from "../../middlewares/auth";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import registrationsController from "./registrations.controller";

const registrations = express.Router();

registrations.post(
  "/",
  contactFormLimiter,
  asyncHandler(registrationsController.create),
);
registrations.post(
  "/initiate-payment",
  contactFormLimiter,
  asyncHandler(registrationsController.initiatePayment),
);
registrations.post(
  "/verify-payment",
  contactFormLimiter,
  asyncHandler(registrationsController.verifyPayment),
);
registrations.get(
  "/",
  apiReadLimiter,
  requireAdmin,
  asyncHandler(registrationsController.getAll),
);
registrations.patch(
  "/:id/approve",
  contactFormLimiter,
  requireAdmin,
  asyncHandler(registrationsController.approve),
);

export default registrations;
