import { z } from 'zod';

export const KindredCardVMSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  age: z.number().int(),
  photo: z.object({
    uri: z.string(),
    blurhash: z.string(),
    aspectRatio: z.number(),
    alt: z.string(),
  }),
  hook: z.object({
    kind: z.enum(['scene', 'quest', 'kindred']),
    text: z.string(),
  }),
  sharedTags: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      emphasis: z.enum(['rare', 'common']),
    })
  ).max(5),
  primaryAction: z.object({
    type: z.literal('OPEN_SIGNAL_COMPOSER'),
    label: z.string(),
    promptId: z.string(),
  }),
  a11y: z.object({
    label: z.string(),
    hint: z.string(),
  }),
});
export type KindredCardVM = z.infer<typeof KindredCardVMSchema>;

export const SceneSummaryVMSchema = z.object({
  sceneId: z.string(),
  title: z.string(),
  subtitle: z.string(),
  venueName: z.string(),
  distanceMeters: z.number().optional(),
  liveCount: z.number().int().nonnegative(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  bannerUri: z.string().optional(),
  a11y: z.object({
    label: z.string(),
    hint: z.string(),
  }),
});
export type SceneSummaryVM = z.infer<typeof SceneSummaryVMSchema>;

export const QuestInviteVMSchema = z.object({
  questId: z.string(),
  title: z.string(),
  themeNiche: z.string(),
  crewCount: z.number().int(),
  hoursLeft: z.number().int(),
  a11y: z.object({
    label: z.string(),
    hint: z.string(),
  }),
});
export type QuestInviteVM = z.infer<typeof QuestInviteVMSchema>;

export const SceneCarouselSectionSchema = z.object({
  id: z.literal('scenes'),
  type: z.literal('scenes'),
  component: z.literal('SceneCarousel'),
  title: z.string(),
  items: z.array(SceneSummaryVMSchema),
});
export type SceneCarouselSection = z.infer<typeof SceneCarouselSectionSchema>;

export const QuestStackSectionSchema = z.object({
  id: z.literal('quests'),
  type: z.literal('quests'),
  component: z.literal('QuestStack'),
  title: z.string(),
  items: z.array(QuestInviteVMSchema),
});
export type QuestStackSection = z.infer<typeof QuestStackSectionSchema>;

export const KindredListSectionSchema = z.object({
  id: z.literal('kindred'),
  type: z.literal('kindred'),
  component: z.literal('KindredList'),
  title: z.string(),
  items: z.array(KindredCardVMSchema),
});
export type KindredListSection = z.infer<typeof KindredListSectionSchema>;

export const ExploreNichesSectionSchema = z.object({
  id: z.literal('explore'),
  type: z.literal('explore'),
  component: z.literal('ExploreNichesCTA'),
  title: z.string(),
  subtitle: z.string(),
});
export type ExploreNichesSection = z.infer<typeof ExploreNichesSectionSchema>;

export const FeedSectionSchema = z.discriminatedUnion('component', [
  SceneCarouselSectionSchema,
  QuestStackSectionSchema,
  KindredListSectionSchema,
  ExploreNichesSectionSchema,
]);
export type FeedSection = z.infer<typeof FeedSectionSchema>;
export type UiComponentKey = FeedSection['component'];

export const HomeFeedResponseSchema = z.object({
  schemaVersion: z.literal(3),
  generatedAt: z.string().datetime(),
  sections: z.array(FeedSectionSchema),
  pagination: z.object({
    nextCursor: z.string().nullable(),
  }),
  meta: z.object({
    degraded: z.array(z.string()),
    requestId: z.string(),
  }),
});
export type HomeFeedResponse = z.infer<typeof HomeFeedResponseSchema>;
