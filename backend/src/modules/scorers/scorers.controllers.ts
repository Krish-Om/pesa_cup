import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../../utils/app-error";
import scorersService from "./scorers.service";

const scorersController = {
  getAllScorers: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(await scorersService.getAllScorers());
    } catch (err) {
      next(err);
    }
  },
  getScorerById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid scorer ID", 400));
      return;
    }
    try {
      res.status(200).json(await scorersService.getScorerById(id));
    } catch (err) {
      next(err);
    }
  },
  createScorer: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(201).json(await scorersService.createScorer(req.body));
    } catch (err) {
      next(err);
    }
  },
  updateScorer: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid scorer ID", 400));
      return;
    }
    try {
      res.status(200).json(await scorersService.updateScorer(id, req.body));
    } catch (err) {
      next(err);
    }
  },
  deleteScorer: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid scorer ID", 400));
      return;
    }
    try {
      await scorersService.deleteScorer(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default scorersController;
