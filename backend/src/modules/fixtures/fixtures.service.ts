import {FixturesRepository, fixturesRepository} from "./fixtures.repository";
import {logger} from "../../utils/logger"
import {type Fixture, type InsertFixturePayload, insertFixtureSchema} from "./fixture.schema";
import {ZodError} from "zod/v3";

export class FixturesService {
    constructor(private repo: FixturesRepository = fixturesRepository) {
    }

  async getFixtures(): Promise<Fixture[]> {
    let result: Fixture[] = [];

    try {
      logger.debug("Fetching all fixtures...");
      // Cast explicitly to Fixture[] (array) instead of a single Fixture
      const data = await this.repo.getAllFixtures();
      result = (data ?? []) as Fixture[];
    } catch (err) {
      logger.error({ err, fixtures: [] }, "Failed to fetch fixtures...");
      throw err;
    }

    if (result.length === 0) {
      logger.info({ count: 0 }, "No fixtures found.");
      return [];
    }

    logger.info({ count: result.length }, `Found ${result.length} fixtures...`);
    return result;
  }

  async getFixtureById(fixtureId: number): Promise<Fixture> {
    let result: Fixture | null = null;

    try {
      logger.debug({ fixtureId }, "Fetching fixture by ID...");
      const data = await this.repo.getFixtureById(fixtureId);
      result = (data ?? null ) as Fixture;
    } catch (err) {
      // Fixed template string backticks ` ` for interpolation
      logger.error({ err, fixtureId }, `Failed to fetch fixture with id "${fixtureId}"`);
      throw err;
    }

    if (!result) {
      logger.warn({ fixtureId }, "Fixture not found");
      throw new Error(`Fixture with ID ${fixtureId} not found`);
    }

    logger.info({ fixtureId }, `Found fixture with id "${fixtureId}"`);
    return result;
  }

    async createNewFixture(payload: InsertFixturePayload): Promise<Fixture> {
        logger.debug({payload}, "Creating new fixture...");
        let result: Fixture | null = null;
        try {
            const validatedPayload = insertFixtureSchema.parse(payload);
            const data = await this.repo.createFixture(validatedPayload);
            result = (data ?? null ) as Fixture | null;

        } catch (err) {
            logger.error({err, fixture: payload}, 'Failed to create fixture...');
            throw err;
        }
      if (!result) {
        logger.warn({payload}, `Repository returned empty result when creating new fixture `);
        throw new Error(`Failed to create fixture...`);
      }
      logger.info({fixtureId: result.id}, 'New fixture created successfully.');
      return result;
    }

async updateFixture(fixtureId: number, updatedData: Partial<InsertFixturePayload>): Promise<Fixture> {
    logger.debug({ fixtureId, updatedData }, `Updating Fixture ${fixtureId}`);
    let result: Fixture | null = null;

try {
    // 1. Validate payload
    const validatedPayload = insertFixtureSchema.partial().parse(updatedData);

    // 2. Perform DB update
    const data = await this.repo.updateMatchFixture(fixtureId, validatedPayload);
    result = (data ?? null) as Fixture | null;

} catch (err) {
    // 3a. Re-throw ZodError directly to preserve schema validation details for HTTP 400
    if (err instanceof ZodError) {
        throw err;
    }

    // 3b. Log and re-throw actual database execution failures (HTTP 500)
    logger.error({ err, fixtureId }, `Failed to update fixture with id "${fixtureId}".`);
    throw err;
}

// 4. Handle non-existent record
if (!result) {
    logger.warn({ fixtureId, updatedData }, `Failed to update or Fixture not found.`);
    throw new Error(`Fixture with id "${fixtureId}" not found.`);
}

// 5. Fixed primary key property access (result.id)
logger.info({ fixtureId: result.id }, 'Fixture updated successfully.');
return result;
}
}

export const fixturesService = new FixturesService();