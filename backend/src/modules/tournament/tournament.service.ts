import { NotFoundError } from "../../utils/app-error";
import { tournamentRepository } from "./tournament.repository";
import {
  insertTournamentSchema,
  type DBInput,
  type DBReturnType,
  type ZodInput,
} from "./tournament.schema";

export class TournamentService {
  async getAll(): Promise<DBReturnType[]> {
    return tournamentRepository.getAll();
  }

  async getById(id: number): Promise<DBReturnType> {
    const result = await tournamentRepository.getById(id);
    if (!result) throw new NotFoundError(`Tournament with ID ${id} not found`);
    return result;
  }

  async create(payload: ZodInput): Promise<DBReturnType> {
    const validated = insertTournamentSchema.parse(payload);
    if (validated.endDate < validated.startDate) {
      throw new Error("Tournament end date cannot be before start date");
    }
    const result = await tournamentRepository.create(validated as DBInput);
    if (!result) throw new Error("Failed to create tournament");
    return result;
  }

  async update(id: number, payload: Partial<ZodInput>): Promise<DBReturnType> {
    const validated = insertTournamentSchema.partial().parse(payload);
    const result = await tournamentRepository.update(
      id,
      validated as Partial<DBInput>,
    );
    if (!result) throw new NotFoundError(`Tournament with ID ${id} not found`);
    return result;
  }

  async delete(id: number): Promise<DBReturnType> {
    const result = await tournamentRepository.delete(id);
    if (!result) throw new NotFoundError(`Tournament with ID ${id} not found`);
    return result;
  }

  async getMetadata() {
    const [totalTeams, totalMatches, totalGoals, topScorer] = await Promise.all(
      [
        tournamentRepository.getTotalTeams(),
        tournamentRepository.getTotalMatches(),
        tournamentRepository.getTotalGoals(),
        tournamentRepository.getTopScorer(),
      ],
    );

    return {
      name: "Pesa Cup 2026",
      season: "2026",
      venue: "Khwopa Futsal, Bhaktapur",
      organizer: "Pesa Cup Association",
      summaryStats: {
        totalTeams,
        totalMatches,
        totalGoals,
        topScorer: topScorer ?? { playerName: "N/A", goals: 0 },
      },
    };
  }
}

export const tournamentService = new TournamentService();
