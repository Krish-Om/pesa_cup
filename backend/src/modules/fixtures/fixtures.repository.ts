import { dbSession } from "../../config/database";
import {
  fixtures,
  type Fixture,
  type InsertFixturePayload,
} from "./fixture.schema";
import { eq } from "drizzle-orm";

export class FixturesRepository {
  async createFixture(data: InsertFixturePayload): Promise<Fixture> {
    const [result] = await dbSession.insert(fixtures).values(data).returning();
    if (!result) throw new Error("Failed to insert fixture.");
    return (await this.getFixtureById(result.id)) ?? result;
  }

  async getAllFixtures(): Promise<Fixture[]> {
    const rows = await dbSession.query.fixtures.findMany({
      with: { homeTeam: true, awayTeam: true, tournament: true },
    });
    return rows.map((row) => ({
      ...row,
      teamA: row.homeTeam.name,
      teamB: row.awayTeam.name,
    })) as Fixture[];
  }

  async getFixtureById(fixtureId: number): Promise<Fixture | null> {
    const result = await dbSession.query.fixtures.findFirst({
      where: (table, operators) => operators.eq(table.id, fixtureId),
      with: { homeTeam: true, awayTeam: true, tournament: true },
    });
    return result
      ? ({
          ...result,
          teamA: result.homeTeam.name,
          teamB: result.awayTeam.name,
        } as Fixture)
      : null;
  }

  async updateMatchFixture(
    fixtureId: number,
    updatedData: Partial<InsertFixturePayload>,
  ): Promise<Fixture | null> {
    const [result] = await dbSession
      .update(fixtures)
      .set(updatedData)
      .where(eq(fixtures.id, fixtureId))
      .returning();

    return result ? await this.getFixtureById(result.id) : null;
  }
}

export const fixturesRepository = new FixturesRepository();
