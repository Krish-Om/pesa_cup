
// - Tournament: name, season, venue, organizer, summary stats
import { type Request, type Response } from "express";
import tournamentController from "./tournament.controller";

const tournamentServices = {
  getTournamentMetadata: async (req: Request, res: Response) => {
    await tournamentController.getTournamentMetadata(req, res);
  },
};

export default tournamentServices; 