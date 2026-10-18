import { z } from 'zod';

export const ReelFeedItemSchema = z.object({
  reelId: z.string(),
  creator: z.object({
    userId: z.string(),
    username: z.string(),
    avatarUrl: z.string().url(),
    isVerified: z.boolean().default(false),
    isFollowing: z.boolean().default(false),
  }),
  video: z.object({
    videoUrl: z.string().url(),
    thumbnailUrl: z.string().url(),
    durationMs: z.number().int().positive(),
  }),
  audio: z.object({
    audioId: z.string(),
    title: z.string(),
    artist: z.string(),
  }),
  caption: z.string(),
  hashtags: z.array(z.string()).default([]),
  metrics: z.object({
    likes: z.number().int().nonnegative(),
    comments: z.number().int().nonnegative(),
    shares: z.number().int().nonnegative(),
    isLiked: z.boolean().default(false),
    isBookmarked: z.boolean().default(false),
  }),
  publishedAtUtc: z.string(),
});
export type ReelFeedItem = z.infer<typeof ReelFeedItemSchema>;
