import express, { type Request, type Response } from "express";
import standingsController from "./standings.controller";

const standings = express.Router();

// GET all standings
standings.get("/", async (req:Request, res:Response) => {
  req.log.info("GET /api/v1/standings endpoint hit");
  await standingsController.getAllStandings(req, res);
});

// GET standing by id
standings.get("/:id", async (req:Request, res:Response) => {
  req.log.info(`GET /api/v1/standings/${req.params.id} endpoint hit`);
  await standingsController.getStandingById(req, res);
});

// PATCH update standing
// standings.patch("/:id",async (req:Request,res:Response)=>{
//     req.log.info(`PATCH /api/v1/standings/${req.params.id} endpoint hit with body: ${JSON.stringify(req.body)}`);
//     await standingsController.updateStanding(req,res);
// });

export default standings;