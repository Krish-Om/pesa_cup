import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../../utils/app-error";
import { fixturesService } from "./fixtures.service";

const parseId = (value: string): number => Number(value);

const fixtureController = {
  getAllFixtures: async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(await fixturesService.getFixtures());
  },
  getFixtureById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid fixture ID", 400));
      return;
    }
    res.status(200).json(await fixturesService.getFixtureById(id));
  },
  createNewFixture: async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await fixturesService.createNewFixture(req.body));
  },
  updateFixture: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      next(new AppError("Invalid fixture ID", 400));
      return;
    }
    res.status(200).json(await fixturesService.updateFixture(id, req.body));
  },
};

export default fixtureController;
