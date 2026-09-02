import { type NextFunction, type Request, type Response } from "express";

import { standingsService } from "./standings.service";
import { AppError } from "../../utils/app-error";

const standingsController = {
  getAllStandings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await standingsService.getStandings();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  getStandingById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid standing ID", 400));
      return;
    }
    try {
      const result = await standingsService.getStandingById(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  createStanding: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await standingsService.createStanding(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
  updateStandingById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid standing ID", 400));
      return;
    }
    try {
      const result = await standingsService.updateStanding(id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteStanding: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid standing ID", 400));
      return;
    }
    try {
      await standingsService.deleteStanding(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default standingsController;
