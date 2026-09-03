import { eq } from "drizzle-orm";
import { client, dbSession } from "../../config/database";
import {
  tournaments,
  type DBInput,
  type DBReturnType,
} from "./tournament.schema";

export class TournamentRepository {
  async getAll(): Promise<DBReturnType[]> {
    return dbSession.select().from(tournaments).all();
  }

  async getById(id: number): Promise<DBReturnType | null> {
    const result = await dbSession.query.tournaments.findFirst({
      where: (table, operators) => operators.eq(table.id, id),
      with: {
        registrations: { with: { team: true } },
        fixtures: { with: { homeTeam: true, awayTeam: true } },
        standings: { with: { team: true } },
        scorers: { with: { team: true } },
      },
    });
    return result ?? null;
  }

  async create(data: DBInput): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .insert(tournaments)
      .values(data)
      .returning();
    return result ?? null;
  }

  async update(
    id: number,
    data: Partial<DBInput>,
  ): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .update(tournaments)
      .set(data)
      .where(eq(tournaments.id, id))
      .returning();
    return result ?? null;
  }

  async delete(id: number): Promise<DBReturnType | null> {
    const [result] = await dbSession
      .delete(tournaments)
      .where(eq(tournaments.id, id))
      .returning();
    return result ?? null;
  }

  async getTotalTeams(): Promise<number> {
    const row = client
      .query("SELECT COUNT(DISTINCT team_id) AS total FROM standings")
      .get() as { total: number } | null;
    return row?.total ?? 0;
  }

  async getTotalMatches(): Promise<number> {
    const row = client
      .query("SELECT COUNT(*) AS total FROM fixtures")
      .get() as { total: number } | null;
    return row?.total ?? 0;
  }

  async getTotalGoals(): Promise<number> {
    const row = client
      .query(
        "SELECT COALESCE(SUM(score_a), 0) + COALESCE(SUM(score_b), 0) AS total FROM fixtures WHERE status = 'finished'",
      )
      .get() as { total: number } | null;
    return row?.total ?? 0;
  }

  async getTopScorer(): Promise<{ playerName: string; goals: number } | null> {
    const row = client
      .query(
        "SELECT player_name AS playerName, goals FROM scorers ORDER BY goals DESC, assists DESC LIMIT 1",
      )
      .get() as { playerName: string; goals: number } | null;
    return row ?? null;
  }
}

export const tournamentRepository = new TournamentRepository();
