import {type Request, type Response} from "express";
import {fixturesService} from "./fixtures.service";

import {ZodError} from "zod";

const fixtureController = {
    getAllFixtures: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await fixturesService.getFixtures();
            res.status(200).json(result);
        } catch (err : any) {
            res.status(500).json({error: err.message});
        }
    },

    getFixtureById: async (req: Request, res: Response): Promise<void> => {
        const fixtureId = Number(req.params.id);
        if (isNaN(Number(fixtureId))) {
            res.status(400).json({error: "Invalid fixture ID."});
        }
        try {
            const result = await fixturesService.getFixtureById(fixtureId);
            res.status(200).json(result);
        } catch (err : any) {
            res.status(404).json({error: err.message});
        }
    },

    createNewFixture: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await fixturesService.createNewFixture(req.body);
            res.status(201).json(result);
        } catch (err: any) {
          if (err instanceof ZodError) {
            res.status(400).json({
              error: "Validation failed", details: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
              }))
            });
            return;
          }
            res.status(500).json({error: err.message || "Failed to create fixtures."});
        }
    },

    updateFixture: async (req: Request, res: Response): Promise<void> => {
        const fixtureId = Number(req.params.id);
        if (isNaN(Number(fixtureId))) {
            res.status(400).json({error: "Invalid fixture ID."});
        }
        try {
            const result = await fixturesService.updateFixture(fixtureId, req.body);
            res.status(200).json(result);
        } catch (err: any) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: "Validation failed", details: err.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    }))
                });
                return;
            }
            if (err.message?.includes("not found")) {
                res.status(404).json({error: err.message});
                return;
            }
            res.status(500).json({error: "Failed to update fixtures."});
        }
    }
};

export default fixtureController;