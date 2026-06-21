import {type Request, type Response } from "express";
import standingsService from "./standings.service";
import { standingsSchema } from "./standings.schema";
import { z } from "zod";

type Standing = z.infer<typeof standingsSchema>;

const standingsController = {
  getAllStandings: async (req: Request, res: Response): Promise<void> => {
    const result = await standingsService.getAllStandings();
    res.json(result);
  },

    getStandingById: async (req: Request, res: Response): Promise<void> => {
    const standingId = parseInt(req.params.id);
    const result = await standingsService.getStandingById(standingId);
    if (!result) {
      res.status(404).json({ error: `Standing with id ${standingId} not found` });
      return;
    }
      res.json(result);
  },
};

export default standingsController;