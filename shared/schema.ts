import { z } from "zod";

export const AnalysisResponseSchema = z.object({
  overallScore: z.number(),
  projectScore: z.number(),
  consistencyScore: z.number(),
  repoCount: z.number(),
  totalStars: z.number(),
  languages: z.array(z.string()),
  lastUpdated: z.string()
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
