// `GET /api/v1/tournament` - tournament metadata and summary stats
// - Tournament: name, season, venue, organizer, summary stats
import express, { type Request, type Response } from "express";
import tournamentController from "./tournament.controller";

const tournament = express.Router();

// GET tournament metadata and summary stats
tournament.get("/", async (req: Request, res: Response) => {
  req.log.info("GET /api/v1/tournament endpoint hit");
  await tournamentController.getTournamentMetadata(req, res);
});

export default tournament;