import { eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { standings, type DBInput, type DBReturnType } from "./standings.schema";

export class StandingsRepository {
  async getAllStandings(): Promise<DBReturnType[]> {
    return dbSession.select().from(standings).all();
  }

  async getStandingsById(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .select()
      .from(standings)
      .where(eq(standings.id, id));
    return result ?? null;
  }

  async createStandings(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession.insert(standings).values(data).returning();
    return result ?? null;
  }

  async updateStandings(
    id: number,
    data: Partial<DBInput>,
  ): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .update(standings)
      .set(data)
      .where(eq(standings.id, id))
      .returning();
    return result ?? null;
  }

  async deleteStanding(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .delete(standings)
      .where(eq(standings.id, id))
      .returning();
    return result ?? null;
  }
}
export const standingsRepository = new StandingsRepository();