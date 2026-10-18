import { z } from 'zod';

export const CulturalInterestTagSchema = z.object({
  tagId: z.string(),
  label: z.string(),
  ancestors: z.array(z.string()).default([]),
  depth: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  idf: z.number().nonnegative(),
  source: z.enum(['self', 'quest', 'scene']).default('self'),
});
export type CulturalInterestTag = z.infer<typeof CulturalInterestTagSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string().min(1),
  age: z.number().int().min(18),
  birthDate: z.string().datetime(),
  gender: z.string(),
  pronouns: z.string().optional(),
  bio: z.string().max(500).optional(),
  photos: z.array(
    z.object({
      mediaId: z.string(),
      uri: z.string().url(),
      blurhash: z.string(),
      aspectRatio: z.number().positive(),
      altText: z.string().optional(),
      moderation: z.enum(['pending', 'approved', 'rejected']),
    })
  ).min(1),
  languages: z.array(
    z.object({
      code: z.string(),
      proficiency: z.enum(['native', 'fluent', 'conversational']),
    })
  ),
  heritage: z.array(
    z.object({
      regionId: z.string(),
      label: z.string(),
    })
  ),
  interests: z.array(CulturalInterestTagSchema),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    cityId: z.string(),
  }),
  trust: z.object({
    phoneVerified: z.boolean(),
    photoVerified: z.boolean(),
    score: z.number().min(0).max(100),
  }),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
