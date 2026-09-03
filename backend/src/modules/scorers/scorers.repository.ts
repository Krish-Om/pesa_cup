import { desc, eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { scorers, type DBInput, type DBReturnType } from "./scorers.schema";

export class ScorersRepository {
  async getAllScorers(): Promise<DBReturnType[]> {
    return dbSession
      .select()
      .from(scorers)
      .orderBy(desc(scorers.goals), desc(scorers.assists))
      .all();
  }

  async getScorerById(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .select()
      .from(scorers)
      .where(eq(scorers.id, id));
    return result ?? null;
  }

  async createScorer(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession.insert(scorers).values(data).returning();
    return result ?? null;
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
    return result ?? null;
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
