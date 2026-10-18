import { z } from 'zod';

export const StreamMediaItemSchema = z.object({
  contentId: z.string(),
  title: z.string(),
  type: z.enum(['MOVIE', 'SERIES', 'LIVE_EVENT']),
  hlsUrl: z.string().url(),
  drmSystem: z.enum(['WIDEVINE', 'FAIRPLAY', 'CLEARKEY']),
  licenseServerUrl: z.string().url(),
  durationSeconds: z.number().nonnegative(),
  thumbnailUrl: z.string().url(),
});
export type StreamMediaItem = z.infer<typeof StreamMediaItemSchema>;

export const WatchProgressSchema = z.object({
  profileId: z.string(),
  contentId: z.string(),
  playbackSeconds: z.number().nonnegative(),
  totalDurationSeconds: z.number().positive(),
  completed: z.boolean().default(false),
});
export type WatchProgress = z.infer<typeof WatchProgressSchema>;
