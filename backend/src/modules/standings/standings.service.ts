import {StandingsRepository} from './standings.repository';
import { z } from "zod";
import { standingsSchema } from "./standings.schema";

type Standings = z.infer<typeof standingsSchema>;

const repository = new StandingsRepository();

const standingsService = {
  getAllStandings: async (): Promise<Standings[]> => {
    return repository.getAllStandings();
  },

  getStandingById: async (id: number): Promise<Standings | null> => {
    return repository.getStandingsById(id);
  },
};

export default standingsService;