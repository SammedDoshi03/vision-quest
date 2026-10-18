import { Injectable } from '@nestjs/common';
import type {
  UserProfile,
  SceneSummaryVM,
  QuestInviteVM,
  CheckInResponse,
} from '@internal/contracts';

export interface ProfileCardSummary {
  userId: string;
  displayName: string;
  age: number;
  primaryPhoto: {
    mediaId: string;
    uri: string;
    blurhash: string;
    width: number;
    height: number;
    altText?: string;
  };
  revealLevel: number; // 0..3 (server-side privacy blur calculation)
}

export interface KindredMatchCandidate {
  userId: string;
  origin: 'scene' | 'quest' | 'kindred';
  originTitle?: string;
  score: number;
  sharedTags: Array<{ tagId: string; label: string; idf: number; depth: number }>;
  suggestedPromptId: string;
}

@Injectable()
export class MockDomainServices {
  private users: Map<string, UserProfile> = new Map([
    [
      'user_asha',
      {
        id: 'user_asha',
        displayName: 'Asha',
        age: 28,
        birthDate: '1998-05-14T00:00:00.000Z',
        gender: 'Woman',
        bio: 'Carnatic violinist, filter coffee fanatic, weekend trekker',
        photos: [
          {
            mediaId: 'm_asha_1',
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
            aspectRatio: 0.8,
            altText: 'Asha smiling with violin',
            moderation: 'approved',
          },
        ],
        languages: [{ code: 'kn', proficiency: 'native' }, { code: 'en', proficiency: 'fluent' }],
        heritage: [{ regionId: 'mysore', label: 'Mysuru' }],
        interests: [
          { tagId: 'tag_carnatic_violin', label: 'Carnatic Violin', depth: 5, idf: 4.8, ancestors: ['music', 'carnatic'], source: 'self' },
          { tagId: 'tag_filter_coffee', label: 'Filter Coffee', depth: 4, idf: 3.2, ancestors: ['food'], source: 'self' },
        ],
        location: { coordinates: [77.5946, 12.9716], cityId: 'bengaluru' },
        trust: { phoneVerified: true, photoVerified: true, score: 98 },
      },
    ],
    [
      'user_rohan',
      {
        id: 'user_rohan',
        displayName: 'Rohan',
        age: 29,
        birthDate: '1997-02-18T00:00:00.000Z',
        gender: 'Man',
        bio: 'Jazz guitarist experimenting with Konnakol rhythms',
        photos: [
          {
            mediaId: 'm_rohan_1',
            uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            blurhash: 'L3N_#_00_3~qofIU%M%M00_3%M?b',
            aspectRatio: 0.8,
            altText: 'Rohan holding an archtop guitar',
            moderation: 'approved',
          },
        ],
        languages: [{ code: 'hi', proficiency: 'native' }, { code: 'en', proficiency: 'fluent' }],
        heritage: [{ regionId: 'delhi', label: 'Old Delhi' }],
        interests: [
          { tagId: 'tag_carnatic_violin', label: 'Carnatic Violin', depth: 4, idf: 4.8, ancestors: ['music', 'carnatic'], source: 'self' },
          { tagId: 'tag_konnakol', label: 'Konnakol', depth: 4, idf: 4.5, ancestors: ['music', 'percussion'], source: 'self' },
        ],
        location: { coordinates: [77.6412, 12.9784], cityId: 'bengaluru' },
        trust: { phoneVerified: true, photoVerified: true, score: 92 },
      },
    ],
  ]);

  private blockedPairs = new Set<string>(); // "viewer:target"

  async getLiveScenesNearby(params: {
    lat: number;
    lng: number;
    radiusKm: number;
    limit: number;
  }): Promise<{ scenes: SceneSummaryVM[]; attendeePreviewIds: string[] }> {
    return {
      scenes: [
        {
          sceneId: 'scene_indie_fusion_blr',
          title: 'Indie Fusion Acoustic Session',
          subtitle: 'Live classical fusion in Indiranagar',
          venueName: 'The Humming Tree Roastery',
          distanceMeters: 650,
          liveCount: 16,
          startsAt: new Date(Date.now() - 3600000).toISOString(),
          endsAt: new Date(Date.now() + 10800000).toISOString(),
          a11y: {
            label: 'Indie Fusion Acoustic Session at The Humming Tree Roastery. 16 people present now.',
            hint: 'Double-tap to view Scene and verified check-in details',
          },
        },
      ],
      attendeePreviewIds: ['user_rohan'],
    };
  }

  async getKindredCandidates(viewerId: string): Promise<{
    candidates: KindredMatchCandidate[];
    nextCursor: string | null;
  }> {
    return {
      candidates: [
        {
          userId: 'user_asha',
          origin: 'kindred',
          score: 8.6,
          sharedTags: [
            { tagId: 'tag_carnatic_violin', label: 'Carnatic Violin', idf: 4.8, depth: 5 },
            { tagId: 'tag_filter_coffee', label: 'Filter Coffee', idf: 3.2, depth: 4 },
          ],
          suggestedPromptId: 'prompt_violin_raag',
        },
      ],
      nextCursor: null,
    };
  }

  async getOpenQuests(viewerId: string): Promise<QuestInviteVM[]> {
    return [
      {
        questId: 'quest_natya_sangeet_70s',
        title: 'Curate 70s Marathi Natya Sangeet Playlist',
        themeNiche: 'Indian Classical Theatre',
        crewCount: 4,
        hoursLeft: 42,
        a11y: {
          label: 'Co-Op Quest: Curate 70s Marathi Natya Sangeet Playlist. 4 of 6 crew members collaborating. 42 hours remaining.',
          hint: 'Double tap to open quest workspace',
        },
      },
    ];
  }

  async batchGetProfileCards(
    viewerId: string,
    userIds: string[]
  ): Promise<ProfileCardSummary[]> {
    const cards: ProfileCardSummary[] = [];
    for (const id of userIds) {
      const u = this.users.get(id);
      if (u) {
        cards.push({
          userId: u.id,
          displayName: u.displayName,
          age: u.age,
          primaryPhoto: {
            mediaId: u.photos[0].mediaId,
            uri: u.photos[0].uri,
            blurhash: u.photos[0].blurhash,
            width: 720,
            height: 900,
            altText: u.photos[0].altText,
          },
          revealLevel: 2, // Progressive reveal state
        });
      }
    }
    return cards;
  }

  async filterVisible(viewerId: string, userIds: string[]): Promise<string[]> {
    // Safety check: eliminate any user blocked by viewer or who blocked viewer
    return userIds.filter((targetId) => {
      const key1 = `${viewerId}:${targetId}`;
      const key2 = `${targetId}:${viewerId}`;
      return !this.blockedPairs.has(key1) && !this.blockedPairs.has(key2);
    });
  }

  async verifyCheckIn(
    userId: string,
    sceneId: string,
    coordinates: [number, number]
  ): Promise<CheckInResponse> {
    return {
      success: true,
      sceneId,
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 3600000).toISOString(), // Afterglow window
      activeCoPresentCount: 17,
    };
  }
}
