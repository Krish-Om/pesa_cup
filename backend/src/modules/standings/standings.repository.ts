import { eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { standings, type DBInput, type DBReturnType } from "./standings.schema";

export class StandingsRepository {
  async getAllStandings(): Promise<DBReturnType[]> {
    const rows = await dbSession.query.standings.findMany({
      with: { team: true, tournament: true },
    });
    return rows.map((row) => ({
      ...row,
      team: row.team.name,
    })) as DBReturnType[];
  }

  async getStandingsById(id: number): Promise<DBReturnType | null> {
    const result = await dbSession.query.standings.findFirst({
      where: (table, operators) => operators.eq(table.id, id),
      with: { team: true, tournament: true },
    });
    return result
      ? ({ ...result, team: result.team.name } as DBReturnType)
      : null;
  }

  async createStandings(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession.insert(standings).values(data).returning();
    return result ? await this.getStandingsById(result.id) : null;
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
    return result ? await this.getStandingsById(result.id) : null;
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
