import express from "express";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import tournamentController from "./tournament.controller";

const tournament = express.Router();
const tournaments = express.Router();

tournament.get(
  "/",
  apiReadLimiter,
  asyncHandler(tournamentController.getTournamentMetadata),
);
tournaments.get("/", apiReadLimiter, asyncHandler(tournamentController.getAll));
tournaments.get(
  "/:id",
  apiReadLimiter,
  asyncHandler(tournamentController.getById),
);
tournaments.post(
  "/",
  contactFormLimiter,
  asyncHandler(tournamentController.create),
);
tournaments.patch(
  "/:id",
  contactFormLimiter,
  asyncHandler(tournamentController.update),
);
tournaments.delete(
  "/:id",
  contactFormLimiter,
  asyncHandler(tournamentController.delete),
);

export default tournament;
export { tournaments as tournamentsRouter };
