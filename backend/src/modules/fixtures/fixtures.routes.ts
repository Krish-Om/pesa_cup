import express from "express";
import fixturesController from "./fixtures.controller";
const fixtures = express.Router();

fixtures.get("/",fixturesController.getAllFixtures)
fixtures.get("/:id",fixturesController.getFixtureById)
fixtures.post("/",fixturesController.createNewFixture)
fixtures.patch("/:id",fixturesController.updateFixture)

export default fixtures;
