import express, { type Request, type Response } from "express";
import fixtureController from "./fixtures.controller";

const fixtures = express.Router();

// GET all fixtures
fixtures.get("/", async (req:Request, res:Response) => {
  req.log.info("GET /api/v1/fixtures endpoint hit");
  await fixtureController.getAllFixtures(req, res);
});

// GET fixture by id
fixtures.get("/:id", async (req:Request, res:Response) => {
  req.log.info(`GET /api/v1/fixtures/${req.params.id} endpoint hit`);
await fixtureController.getFixtureById(req, res);
});

// PATCH update fixture
fixtures.patch("/:id",async (req:Request,res:Response)=>{
    req.log.info(`PATCH /api/v1/fixtures/${req.params.id} endpoint hit with body: ${JSON.stringify(req.body)}`);
    await fixtureController.updateFixture(req,res);
});

export default fixtures;
