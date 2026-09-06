import express from "express";
import standingsController from "./standings.controller";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import { requireAdmin } from "../../middlewares/auth";

const standings = express.Router();

standings.get(
  "/",
  apiReadLimiter,
  asyncHandler(standingsController.getAllStandings),
);
standings.get(
  "/:id",
  apiReadLimiter,
  asyncHandler(standingsController.getStandingById),
);

standings.use(requireAdmin); // Apply requireAdmin middleware to all routes below
standings.post(
  "/",
  contactFormLimiter,
  asyncHandler(standingsController.createStanding),
);
standings.put(
  "/:id",
  contactFormLimiter,
  asyncHandler(standingsController.updateStandingById),
);
standings.patch(
  "/:id",
  contactFormLimiter,
  asyncHandler(standingsController.updateStandingById),
);
standings.delete(
  "/:id",
  contactFormLimiter,
  asyncHandler(standingsController.deleteStanding),
);
export default standings;
