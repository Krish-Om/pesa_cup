import { z } from "zod";

export const standingsSchema = z.object({
  id: z.number().int().optional(),
    team: z.string().min(1, "Team name is required"),
    group: z.string().min(1, "Group is required"),
    played: z.number().int().nonnegative().default(0),
    won: z.number().int().nonnegative().default(0),
    draw: z.number().int().nonnegative().default(0),
    lost: z.number().int().nonnegative().default(0),
    goalFor: z.number().int().nonnegative().default(0),
    goalAgainst: z.number().int().nonnegative().default(0),
    goalDifference: z.number().int().default(0),
    points: z.number().int().nonnegative().default(0),
    position: z.number().int().optional(),
    created_at: z.string().optional(),
});