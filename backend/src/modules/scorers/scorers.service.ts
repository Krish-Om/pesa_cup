import { NotFoundError } from "../../utils/app-error";
import { ScorersRepository, scorersRepository } from "./scorers.repository";
import {
  insertScorerSchema,
  type DBInput,
  type DBReturnType,
  type ZodInput,
} from "./scorers.schema";

export class ScorersService {
  constructor(private readonly repo: ScorersRepository = scorersRepository) {}

  async getAllScorers(): Promise<DBReturnType[]> {
    return this.repo.getAllScorers();
  }

  async getScorerById(id: number): Promise<DBReturnType> {
    const result = await this.repo.getScorerById(id);
    if (!result) throw new NotFoundError(`Scorer with ID ${id} not found`);
    return result;
  }

  async createScorer(payload: ZodInput): Promise<DBReturnType> {
    const result = await this.repo.createScorer(
      insertScorerSchema.parse(payload) as DBInput,
    );
    if (!result) throw new Error("Failed to create scorer");
    return result;
  }

  async updateScorer(
    id: number,
    payload: Partial<ZodInput>,
  ): Promise<DBReturnType> {
    const result = await this.repo.updateScorer(
      id,
      insertScorerSchema.partial().parse(payload) as Partial<DBInput>,
    );
    if (!result) throw new NotFoundError(`Scorer with ID ${id} not found`);
    return result;
  }

  async deleteScorer(id: number): Promise<DBReturnType> {
    const result = await this.repo.deleteScorer(id);
    if (!result) throw new NotFoundError(`Scorer with ID ${id} not found`);
    return result;
  }
}

export const scorersService = new ScorersService();
export default scorersService;
