import express from "express";
import { asyncHandler } from "../../middlewares/error-handler";
import { requireAdmin } from "../../middlewares/auth";
import {
  apiReadLimiter,
  contactFormLimiter,
  registrationLimiter,
} from "../../middlewares/rate-limiter";
import { uploadReceipt } from "../../middlewares/upload";
import registrationsController from "./registrations.controller";

const registrations = express.Router();

// Public: upload a payment receipt screenshot — returns { url: "/uploads/receipts/..." }
registrations.post(
  "/upload-receipt",
  registrationLimiter,
  uploadReceipt.single("receipt"),
  asyncHandler(registrationsController.uploadReceipt),
);

// Public: submit a completed registration
registrations.post(
  "/",
  registrationLimiter,
  asyncHandler(registrationsController.create),
);

// Admin: list all registrations
registrations.get(
  "/",
  apiReadLimiter,
  requireAdmin,
  asyncHandler(registrationsController.getAll),
);

// Admin: approve a pending registration
registrations.patch(
  "/:id/approve",
  contactFormLimiter,
  requireAdmin,
  asyncHandler(registrationsController.approve),
);

// Admin: reject a pending registration
registrations.patch(
  "/:id/reject",
  contactFormLimiter,
  requireAdmin,
  asyncHandler(registrationsController.reject),
);

export default registrations;
