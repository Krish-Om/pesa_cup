import { type Request,type Response } from "express";
// - Tournament: name, season, venue, organizer, summary stats
const tournamentController = {
  getTournamentMetadata: async (req: Request, res: Response) => {
    try {
      // Mock data for tournament metadata and summary stats
      const tournamentData = {
        name: "Pesa Cup 2026",
        season: "2026",
        venue: "Khwopa Futsal, Bhaktapur",
        organizer: "Pesa Cup Association",
        summaryStats: {
          totalTeams: 16,
          totalMatches: 32,
          totalGoals: 120,
          topScorer: {
            name: "John Doe",
            goals: 10,
          },
        },
      };
      res.status(200).json(tournamentData);
    } catch (error) {
      req.log.error({ error }, "Error fetching tournament metadata:");
      res.status(500).json({ error: "Failed to fetch tournament metadata" });
    }   
  }
};

export default tournamentController;