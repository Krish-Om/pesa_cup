import { type Request, type Response } from "express";
import {fixturesService} from "./fixtures.service";

import {ZodError} from "zod/v3";

const fixtureController = {
  getAllFixtures: async (req:Request,res: Response): Promise<void> => {
    try{
    const result = await fixturesService.getFixtures();
    res.status(200).json(result);
    }catch(err){
      res.status(500).json({error:"Failed to retrieve fixtures."});
    }
  },

  getFixtureById: async (req: Request, res: Response): Promise<void> => {
    const fixtureId = Number(req.params.id);
    if(isNaN(Number(fixtureId))){
      res.status(400).json({error:"Invalid fixture ID."});
    }
    try{
    const result = await fixturesService.getFixtureById(fixtureId);
    res.status(200).json(result);
    }catch(err){
      res.status(404).json({error:"Failed to retrieve fixtures."});
    }
  },

  createNewFixture: async(req:Request, res: Response) :Promise<void> => {
    try{
    const result = await fixturesService.createNewFixture(req.body);
    res.status(201).json(result);
    }catch(err:any){
      if(err instanceof ZodError){
        res.status(400).json({error: "Validation failed",details: err.errors});
      }
      res.status(500).json({error:err.message || "Failed to create fixtures."});
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
    }catch(err:any){
      if(err instanceof ZodError){
        res.status(400).json({error:"Validation failed",details: err.errors});
        return;
      }
      if(err.message?.includes("not found")){
        res.status(404).json({error:err.message});
        return;
      }
      res.status(500).json({error:"Failed to update fixtures."});
    }
  }
};

export default fixtureController;