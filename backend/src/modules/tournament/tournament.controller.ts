import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../../utils/app-error";
import { tournamentService } from "./tournament.service";

// Safe integer validation helper
const parseValidId = (value: string | undefined): number | null => {
  const parsed = globalThis.Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const tournamentController = {
  getTournamentMetadata: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(await tournamentService.getMetadata());
    } catch (err) {
      next(err);
    }
  },

  getAll: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(await tournamentService.getAll());
    } catch (err) {
      next(err);
    }
  },

  getById: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    const id = parseValidId(req.params.id);
    if (!id) {
      next(new AppError("Invalid tournament ID", 400));
      return;
    }
    try {
      res.status(200).json(await tournamentService.getById(id));
    } catch (err) {
      next(err);
    }
  },

  create: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(201).json(await tournamentService.create(req.body));
    } catch (err) {
      next(err);
    }
  },

  update: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    const id = parseValidId(req.params.id);
    if (!id) {
      next(new AppError("Invalid tournament ID", 400));
      return;
    }
    try {
      res.status(200).json(await tournamentService.update(id, req.body));
    } catch (err) {
      next(err);
    }
  },

  delete: async (
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void> => {
    const id = parseValidId(req.params.id);
    if (!id) {
      next(new AppError("Invalid tournament ID", 400));
      return;
    }
    try {
      await tournamentService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default tournamentController;