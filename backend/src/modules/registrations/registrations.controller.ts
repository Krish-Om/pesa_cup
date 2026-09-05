import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { registrationsService } from "./registrations.service";

const parseId = (value: string): number => Number(value);

const registrationsController = {
  create: async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await registrationsService.create(req.body));
  },
  getAll: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(await registrationsService.getAll());
  },
  approve: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid registration ID", 400));
      return;
    }
    res.status(200).json(await registrationsService.approve(id, req.body));
  },
};

export default registrationsController;
