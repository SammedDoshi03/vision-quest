import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { ReelFeedItem } from '@internal/contracts';
import { TEST_LOCATORS } from '@internal/contracts';
import { ResponsiveContainer, RoleSelector } from '@internal/ui-kit';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_REELS: ReelFeedItem[] = [
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
      title: 'Sunset Acoustic Reverie 🎵',
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
      title: 'Sizzling Wok Beats 🍳',
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

export function ReelsView() {
  const [activeRole, setActiveRole] = useState<'primary' | 'secondary'>('primary');
  const [reels, setReels] = useState<ReelFeedItem[]>(MOCK_REELS);
  const [lastTap, setLastTap] = useState<number>(0);

  const handleDoubleTap = (reelId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleLike(reelId);
    }
    setLastTap(now);
  };

  const toggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.reelId === reelId) {
          const isLiked = !r.metrics.isLiked;
          return {
            ...r,
            metrics: {
              ...r.metrics,
              isLiked,
              likes: isLiked ? r.metrics.likes + 1 : r.metrics.likes - 1,
            },
          };
        }
        return r;
      })
    );
  };

  const renderViewerView = () => (
    <View style={styles.viewerContainer}>
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      >
        {reels.map((reel) => (
          <Pressable
            key={reel.reelId}
            style={styles.reelCard}
            onPress={() => handleDoubleTap(reel.reelId)}
          >
            {/* Background Simulated Video Canvas */}
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoWatermark}>▶ VIDEO STREAM ACTIVE</Text>
              <Text style={styles.soundIndicator}>🔊 {reel.audio.title}</Text>
            </View>

            {/* Floating Right Actions Bar */}
            <View style={styles.rightActionsColumn}>
              <Pressable
                style={styles.actionIconBtn}
                onPress={() => toggleLike(reel.reelId)}
                testID={TEST_LOCATORS.REELS.VIEWER_LIKE_BTN}
              >
                <Text style={styles.actionEmoji}>{reel.metrics.isLiked ? '❤️' : '🤍'}</Text>
                <Text style={styles.actionCount}>{reel.metrics.likes.toLocaleString()}</Text>
              </Pressable>

              <Pressable
                style={styles.actionIconBtn}
                onPress={() => Alert.alert('Comments', `Reading ${reel.metrics.comments} comments`)}
              >
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionCount}>{reel.metrics.comments.toLocaleString()}</Text>
              </Pressable>

              <Pressable
                style={styles.actionIconBtn}
                onPress={() => Alert.alert('Share', 'Share reel via WhatsApp or Instagram')}
                testID={TEST_LOCATORS.REELS.VIEWER_SHARE_BTN}
              >
                <Text style={styles.actionEmoji}>✈️</Text>
                <Text style={styles.actionCount}>{reel.metrics.shares.toLocaleString()}</Text>
              </Pressable>

              <View style={styles.vinylDisk}>
                <Text style={styles.vinylEmoji}>💿</Text>
              </View>
            </View>

            {/* Bottom Metadata Overlay */}
            <SafeAreaView style={styles.bottomOverlay}>
              <View style={styles.creatorRow}>
                <Text style={styles.creatorUsername}>@{reel.creator.username}</Text>
                {reel.creator.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
                <Pressable
                  style={styles.followPill}
                  onPress={() => Alert.alert('Follow', `Following @${reel.creator.username}`)}
                >
                  <Text style={styles.followPillText}>Follow</Text>
                </Pressable>
              </View>

              <Text style={styles.captionText}>{reel.caption}</Text>

              {/* Music Marquee Bar */}
              <View style={styles.audioMarquee}>
                <Text style={styles.audioIcon}>🎵</Text>
                <Text style={styles.audioTrackName}>
                  {reel.audio.title} • {reel.audio.artist}
                </Text>
              </View>
            </SafeAreaView>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderCreatorStudioView = () => (
    <View style={styles.studioContainer} testID={TEST_LOCATORS.REELS.CREATOR_ANALYTICS_PANEL}>
      <Text style={styles.studioTitle}>Creator Studio & Analytics</Text>
      <Text style={styles.studioSubtitle}>Publish Reels, Monitor Retention & Audio Sync</Text>

      {/* Analytics Cards */}
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsTile}>
          <Text style={styles.analyticsLabel}>Total Views (7d)</Text>
          <Text style={styles.analyticsVal}>142,800</Text>
        </View>
        <View style={styles.analyticsTile}>
          <Text style={styles.analyticsLabel}>Avg Retention</Text>
          <Text style={[styles.analyticsVal, { color: '#10B981' }]}>84.2%</Text>
        </View>
      </View>

      {/* Upload Draft Card */}
      <View style={styles.uploadCard}>
        <Text style={styles.uploadCardTitle}>Draft Short Video Ready</Text>
        <Text style={styles.uploadCardDesc}>Rendered 1080x1920 (9:16) H.264 • 0:15s duration</Text>

        <Pressable
          style={styles.uploadBtn}
          onPress={() => Alert.alert('Reel Published', 'Reel uploaded to global feed and CDN edge transcoding triggered.')}
          testID={TEST_LOCATORS.REELS.CREATOR_UPLOAD_DRAFT_BTN}
        >
          <Text style={styles.uploadBtnText}>🚀 Publish Reel to Worldwide Feed</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container} testID={TEST_LOCATORS.REELS.CONTAINER}>
      <RoleSelector
        primaryRoleLabel="Reels Feed"
        secondaryRoleLabel="Creator Studio"
        primaryIcon="📱"
        secondaryIcon="🎬"
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        testIDPrefix="reels"
      />
      <ResponsiveContainer
        scrollable={false}
        leftPane={renderViewerView()}
        rightPane={renderCreatorStudioView()}
      >
        {activeRole === 'primary' ? renderViewerView() : renderCreatorStudioView()}
      </ResponsiveContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
  },
  reelCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 170,
    backgroundColor: '#111827',
    position: 'relative',
    justifyContent: 'space-between',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E1E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWatermark: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  soundIndicator: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  rightActionsColumn: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    alignItems: 'center',
    gap: 18,
    zIndex: 10,
  },
  actionIconBtn: {
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  vinylDisk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  vinylEmoji: {
    fontSize: 22,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 16,
    bottom: 20,
    right: 70,
    zIndex: 10,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  creatorUsername: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  verifiedBadge: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  followPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  followPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  captionText: {
    color: '#F9FAFB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  audioMarquee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  audioIcon: {
    fontSize: 13,
  },
  audioTrackName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  studioContainer: {
    padding: 16,
    width: '100%',
  },
  studioTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studioSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  analyticsTile: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
  },
  analyticsLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  analyticsVal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  uploadCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  uploadCardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  uploadCardDesc: {
    color: '#64748B',
    fontSize: 12,
    marginVertical: 8,
  },
  uploadBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
