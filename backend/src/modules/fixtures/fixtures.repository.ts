import {z} from "zod";
import {dbSession} from "../../config/database.ts";
import {fixtures, type InsertFixturePayload} from "./fixture.schema";
import {eq} from "drizzle-orm";

type Fixture = z.infer<typeof fixtures>;

export class FixturesRepository {
    async createFixture(data: InsertFixturePayload): Promise<Fixture> {
        const [result] = await dbSession.insert(fixtures).values(data).returning();
        return result;
    }

    async getAllFixtures(): Promise<Fixture[]> {
        return dbSession.select().from(fixtures);
    }

    async getFixtureById(fixtureId: number): Promise<Fixture | null> {
        return dbSession.select().from(fixtures).where(eq(fixtures.id, fixtureId)).get();
    }

    async updateMatchFixture(
        fixtureId: number,
        updatedData: Partial<InsertFixturePayload>
    ): Promise<Fixture | null> {
        const [result] = await dbSession.update(fixtures).set(updatedData).where(eq(fixtures.id, fixtureId)).returning();
        return result ?? null;
    }
}

export const fixturesRepository = new FixturesRepository();