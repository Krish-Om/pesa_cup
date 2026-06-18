import { z } from "zod";
import dbSession from "../../config/database.ts";
import { standingsSchema } from "./standings.schema";

type Standings = z.infer<typeof standingsSchema>;

export class StandingsRepository {
  async getAllStandings(): Promise<Standings[]> {
    return dbSession.query<Standings>("SELECT * FROM standings");
  }

  async getStandingsById(standingsId: number): Promise<Standings | null> {
    const standings = await dbSession.query<Standings>(
      "SELECT * FROM standings WHERE id = ?",
      [standingsId],
    );
    return standings?.[0] ?? null;
  }
}
