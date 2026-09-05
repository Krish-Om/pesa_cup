import { desc, eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { scorers, type DBInput, type DBReturnType } from "./scorers.schema";

export class ScorersRepository {
  async getAllScorers(): Promise<DBReturnType[]> {
    const rows = await dbSession.query.scorers.findMany({
      orderBy: (table, { desc: orderDesc }) => [
        orderDesc(table.goals),
        orderDesc(table.assists),
      ],
      with: { team: true, tournament: true },
    });
    return rows.map((row) => ({
      ...row,
      teamName: row.team.name,
    })) as DBReturnType[];
  }

  async getScorerById(id: number): Promise<DBReturnType | null> {
    const result = await dbSession.query.scorers.findFirst({
      where: (table, operators) => operators.eq(table.id, id),
      with: { team: true, tournament: true },
    });
    return result
      ? ({ ...result, teamName: result.team.name } as DBReturnType)
      : null;
  }

  async createScorer(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession.insert(scorers).values(data).returning();
    return result ? await this.getScorerById(result.id) : null;
  }

  async updateScorer(
    id: number,
    data: Partial<DBInput>,
  ): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .update(scorers)
      .set(data)
      .where(eq(scorers.id, id))
      .returning();
    return result ? await this.getScorerById(result.id) : null;
  }

  async deleteScorer(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .delete(scorers)
      .where(eq(scorers.id, id))
      .returning();
    return result ?? null;
  }
}

export const scorersRepository = new ScorersRepository();
