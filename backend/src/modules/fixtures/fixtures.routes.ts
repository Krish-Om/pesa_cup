import express from "express";
import fixturesController from "./fixtures.controller";
import { asyncHandler } from "../../middlewares/error-handler";
import {
  apiReadLimiter,
  contactFormLimiter,
} from "../../middlewares/rate-limiter";
import { requireAdmin } from "../../middlewares/auth";
const fixtures = express.Router();

fixtures.get(
  "/",
  apiReadLimiter,
  asyncHandler(fixturesController.getAllFixtures),
);
fixtures.get(
  "/:id",
  apiReadLimiter,
  asyncHandler(fixturesController.getFixtureById),
);

fixtures.use(requireAdmin); // Apply requireAdmin middleware to all routes below
fixtures.post(
  "/",
  contactFormLimiter,
  asyncHandler(fixturesController.createNewFixture),
);
fixtures.put(
  "/:id",
  contactFormLimiter,
  asyncHandler(fixturesController.updateFixture),
);
fixtures.patch(
  "/:id",
  contactFormLimiter,
  asyncHandler(fixturesController.updateFixture),
);

export default fixtures;
