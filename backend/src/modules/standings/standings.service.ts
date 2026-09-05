import {
  standingsRepository,
  StandingsRepository,
} from "./standings.repository";
import { ZodError } from "zod";
import { logger } from "../../utils/logger.ts";
import { NotFoundError } from "../../utils/app-error";
import {
  type InsertStandingInput,
  type Standings,
  insertStandingSchema,
} from "./standings.schema";

export class StandingsService {
  constructor(
    private readonly repo: StandingsRepository = standingsRepository,
  ) {}
  async getStandings(): Promise<Standings[]> {
    let result: Standings[] = [];
    try {
      logger.debug("Fetching all standings...");
      const data = await this.repo.getAllStandings();
      result = (data ?? []) as Standings[];
    } catch (err) {
      logger.error("Failed fetching standings...");
      throw err;
    }
    if (result.length === 0) {
      logger.info({ count: 0 }, "Standings not found");
      return [];
    }
    logger.info({ count: result.length }, "Standings found");
    return result;
  }

  async getStandingById(id: number): Promise<Standings> {
    let result: Standings | null = null;
    try {
      logger.debug("Fetching standingById...");
      const data = await this.repo.getStandingsById(id);
      result = data ?? null;
    } catch (err) {
      logger.error({ err, id }, `Standings with id ${id} not found`);
      throw err;
    }

    if (!result) {
      logger.warn("Standings not found");
      throw new NotFoundError(`Standings with ID ${id} not found`);
    }

    logger.info({ id }, `Standings with ID ${id} found`);
    return result;
  }

  async createStanding(payload: InsertStandingInput): Promise<Standings> {
    let result: Standings | null = null;
    try {
      logger.debug("Creating standing...");
      const validatedPayload = insertStandingSchema.parse(payload);
      const data = await this.repo.createStandings(validatedPayload);
      result = data ?? null;
    } catch (err) {
      if (err instanceof ZodError) throw err;
      logger.error({ err, standing: payload }, "Failed to create standings...");
      throw err;
    }
    if (!result) {
      logger.warn(
        { payload },
        "Repository returned empty result when creating standing",
      );
      throw new Error("Failed to create standing");
    }
    logger.info({ id: result.id }, `Standings with ID ${result.id} created`);
    return result;
  }

  async updateStanding(
    id: number,
    updatedData: Partial<InsertStandingInput>,
  ): Promise<Standings> {
    logger.debug({ updatedData, id }, "Creating standing...");
    let result: Standings | null = null;
    try {
      const validatedPayload = insertStandingSchema
        .partial()
        .parse(updatedData);

      const data = await this.repo.updateStandings(id, validatedPayload);
      result = (data ?? null) as Standings | null;
    } catch (err) {
      if (err instanceof ZodError) {
        throw err;
      }
      logger.error({ err, id }, `Failed to update standings with id : ${id}`);
      throw err;
    }
    if (!result) {
      logger.warn({ id, updatedData }, `Standings with ID ${id} not found`);
      throw new NotFoundError(`Standings with ID ${id} not found`);
    }
    logger.info({ id }, `Standings with ID ${id} updated`);
    return result;
  }

  async deleteStanding(id: number): Promise<Standings> {
    const result = await this.repo.deleteStanding(id);
    if (!result) {
      throw new NotFoundError(`Standings with ID ${id} not found`);
    }
    logger.info({ id }, `Standings with ID ${id} deleted`);
    return result;
  }
}

export const standingsService = new StandingsService();
