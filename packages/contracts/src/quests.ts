import { z } from 'zod';

export const QuestTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  durationHours: z.number().int(),
  minCrewSize: z.number().int().default(4),
  maxCrewSize: z.number().int().default(6),
});
export type QuestTask = z.infer<typeof QuestTaskSchema>;

export const KudosPayloadSchema = z.object({
  questId: z.string(),
  targetUserId: z.string(),
  appreciationNote: z.string().max(200).optional(),
});
export type KudosPayload = z.infer<typeof KudosPayloadSchema>;

export const KudosResponseSchema = z.object({
  acknowledged: z.boolean(),
  isMutualMatch: z.boolean(),
  matchId: z.string().optional(),
});
export type KudosResponse = z.infer<typeof KudosResponseSchema>;
