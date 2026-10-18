import type {
  KindredCardVM,
  HomeFeedResponse,
  SceneSummaryVM,
  QuestInviteVM,
  UserProfile,
} from '@internal/contracts';

export function createUserFixture(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'user_101',
    displayName: 'Asha',
    age: 28,
    birthDate: '1998-05-14T00:00:00.000Z',
    gender: 'Woman',
    bio: 'Carnatic violinist, filter coffee fanatic, weekend trekker',
    photos: [
      {
        mediaId: 'media_1',
        uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
        aspectRatio: 0.8,
        altText: 'Asha smiling with her violin',
        moderation: 'approved',
      },
    ],
    languages: [
      { code: 'kn', proficiency: 'native' },
      { code: 'en', proficiency: 'fluent' },
    ],
    heritage: [{ regionId: 'mysore', label: 'Mysuru' }],
    interests: [
      {
        tagId: 'tag_carnatic_violin',
        label: 'Carnatic Violin',
        ancestors: ['music', 'indian_classical', 'carnatic'],
        depth: 5,
        idf: 4.8,
        source: 'self',
      },
      {
        tagId: 'tag_filter_coffee',
        label: 'South Indian Filter Coffee',
        ancestors: ['culinary', 'coffee'],
        depth: 4,
        idf: 3.2,
        source: 'self',
      },
    ],
    location: {
      coordinates: [77.5946, 12.9716],
      cityId: 'bengaluru',
    },
    trust: {
      phoneVerified: true,
      photoVerified: true,
      score: 95,
    },
    ...overrides,
  };
}

export function createKindredCardFixture(overrides: Partial<KindredCardVM> = {}): KindredCardVM {
  return {
    userId: 'user_101',
    displayName: 'Asha',
    age: 28,
    photo: {
      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
      aspectRatio: 0.8,
      alt: 'Photo of Asha',
    },
    hook: {
      kind: 'kindred',
      text: 'Both into Carnatic Violin (Depth 5/5)',
    },
    sharedTags: [
      { id: 'tag_carnatic_violin', label: 'Carnatic Violin', emphasis: 'rare' },
      { id: 'tag_filter_coffee', label: 'Filter Coffee', emphasis: 'common' },
    ],
    primaryAction: {
      type: 'OPEN_SIGNAL_COMPOSER',
      label: 'Send Cultural Wave',
      promptId: 'prompt_violin',
    },
    a11y: {
      label: 'Asha, 28. 2 shared cultural interests including rare Carnatic Violin.',
      hint: 'Double tap to open signal composer',
    },
    ...overrides,
  };
}

export function createSceneSummaryFixture(overrides: Partial<SceneSummaryVM> = {}): SceneSummaryVM {
  return {
    sceneId: 'scene_indie_gig_indiranagar',
    title: 'Indie Fusion Acoustic Night',
    subtitle: 'Live classical fusion in Indiranagar',
    venueName: 'The Humming Tree Roastery',
    distanceMeters: 850,
    liveCount: 14,
    startsAt: new Date(Date.now() - 3600000).toISOString(),
    endsAt: new Date(Date.now() + 7200000).toISOString(),
    a11y: {
      label: 'Indie Fusion Acoustic Night at The Humming Tree Roastery. 14 people present now.',
      hint: 'Double tap to check into this scene',
    },
    ...overrides,
  };
}

export function createQuestInviteFixture(overrides: Partial<QuestInviteVM> = {}): QuestInviteVM {
  return {
    questId: 'quest_marathi_natya_sangeet',
    title: 'Curate 70s Marathi Natya Sangeet Playlist',
    themeNiche: 'Indian Classical Theatre',
    crewCount: 4,
    hoursLeft: 36,
    a11y: {
      label: 'Collaborative quest: Curate 70s Marathi Natya Sangeet Playlist. 4 of 6 crew members collaborating. 36 hours left.',
      hint: 'Double tap to join crew',
    },
    ...overrides,
  };
}

export function createHomeFeedResponseFixture(overrides: Partial<HomeFeedResponse> = {}): HomeFeedResponse {
  return {
    schemaVersion: 3,
    generatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'scenes',
        type: 'scenes',
        component: 'SceneCarousel',
        title: 'Live Scenes Happening Now',
        items: [createSceneSummaryFixture()],
      },
      {
        id: 'quests',
        type: 'quests',
        component: 'QuestStack',
        title: 'Weekly Co-Op Quests',
        items: [createQuestInviteFixture()],
      },
      {
        id: 'kindred',
        type: 'kindred',
        component: 'KindredList',
        title: 'Kindred Alignment Feed',
        items: [createKindredCardFixture()],
      },
    ],
    pagination: {
      nextCursor: 'cursor_page_2',
    },
    meta: {
      degraded: [],
      requestId: 'req_fixture_test_01',
    },
    ...overrides,
  };
}
