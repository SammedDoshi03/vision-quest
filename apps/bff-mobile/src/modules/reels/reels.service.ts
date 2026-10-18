import { Injectable } from '@nestjs/common';
import type { ReelFeedItem } from '@internal/contracts';

@Injectable()
export class ReelsService {
  private reels: ReelFeedItem[] = [
    {
      reelId: 'reel_001',
      creator: {
        userId: 'creator_01',
        username: 'travel_diaries',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        isVerified: true,
        isFollowing: false,
      },
      video: {
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        durationMs: 15000,
      },
      audio: {
        audioId: 'audio_88',
        title: 'Sunset Acoustic Reverie',
        artist: 'Indie Vibes Studio',
      },
      caption: 'Golden hour in the Sahyadri mountains ✨ #wanderlust #nature #reels',
      hashtags: ['wanderlust', 'nature', 'reels'],
      metrics: {
        likes: 12430,
        comments: 482,
        shares: 1980,
        isLiked: false,
        isBookmarked: false,
      },
      publishedAtUtc: new Date().toISOString(),
    },
    {
      reelId: 'reel_002',
      creator: {
        userId: 'creator_02',
        username: 'chef_ananya',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        isVerified: true,
        isFollowing: true,
      },
      video: {
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        durationMs: 22000,
      },
      audio: {
        audioId: 'audio_92',
        title: 'Sizzling Wok Beats',
        artist: 'Urban Beats Lab',
      },
      caption: '60-second artisanal pasta with fresh basil & aged parmesan 🍝 #foodie',
      hashtags: ['foodie', 'pasta', 'quickrecipes'],
      metrics: {
        likes: 28910,
        comments: 1120,
        shares: 5410,
        isLiked: true,
        isBookmarked: true,
      },
      publishedAtUtc: new Date().toISOString(),
    },
  ];

  async getReelFeed(): Promise<ReelFeedItem[]> {
    return this.reels;
  }

  async toggleLike(reelId: string): Promise<{ isLiked: boolean; newLikeCount: number }> {
    const item = this.reels.find((r) => r.reelId === reelId);
    if (!item) return { isLiked: false, newLikeCount: 0 };
    item.metrics.isLiked = !item.metrics.isLiked;
    item.metrics.likes += item.metrics.isLiked ? 1 : -1;
    return { isLiked: item.metrics.isLiked, newLikeCount: item.metrics.likes };
  }
}
