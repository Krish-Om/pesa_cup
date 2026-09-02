import { dbSession } from "../../config/database";
import { fixtures, type Fixture, type InsertFixturePayload } from "./fixture.schema";
import { eq } from "drizzle-orm";

export class FixturesRepository {
    async createFixture(data: InsertFixturePayload): Promise<Fixture> {
        const [result] = await dbSession.insert(fixtures).values(data).returning();
        if (!result) throw new Error("Failed to insert fixture.");
        return result;
    }

    async getAllFixtures(): Promise<Fixture[]> {
        return dbSession.select().from(fixtures).all();
    }

    async getFixtureById(fixtureId: number): Promise<Fixture | null> {
        const [result] = await dbSession.select().from(fixtures).where(eq(fixtures.id, fixtureId));
        return result ?? null;
    }

    async updateMatchFixture(
        fixtureId: number,
        updatedData: Partial<InsertFixturePayload>
    ): Promise<Fixture | null> {
        const [result] = await dbSession
            .update(fixtures)
            .set(updatedData)
            .where(eq(fixtures.id, fixtureId))
            .returning();

        return result ?? null;
    }
}

export const fixturesRepository = new FixturesRepository();