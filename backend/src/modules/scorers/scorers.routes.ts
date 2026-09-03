import express from "express";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import scorersController from "./scorers.controllers";

const scorers = express.Router();

scorers.get("/", apiReadLimiter, asyncHandler(scorersController.getAllScorers));
scorers.get(
  "/:id",
  apiReadLimiter,
  asyncHandler(scorersController.getScorerById),
);
scorers.post(
  "/",
  contactFormLimiter,
  asyncHandler(scorersController.createScorer),
);
scorers.patch(
  "/:id",
  contactFormLimiter,
  asyncHandler(scorersController.updateScorer),
);
scorers.delete(
  "/:id",
  contactFormLimiter,
  asyncHandler(scorersController.deleteScorer),
);

export default scorers;
