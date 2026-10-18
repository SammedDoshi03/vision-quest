import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import { MultiNavigator } from './navigation/MultiNavigator';
import { GlobalErrorBoundary } from './shell';
import { A11yProvider, A11yIsolationRoot, a11y, type FocusableTarget } from '@internal/a11y';
import {
  ThemeProvider,
  PortalHost,
  SlideUpPanel,
  Text,
  Button,
  SectionRenderer,
  useTheme,
  I18nProvider,
  ToastProvider,
  PrivacyProtector,
} from '@internal/ui-kit';
import {
  AuthProvider,
  useSession,
  AuthMachine,
  InMemorySecureStorage,
} from '@internal/auth';
import {
  type HomeFeedResponse,
  type KindredCardVM,
  type SceneSummaryVM,
  type QuestInviteVM,
  nativeBridge,
} from '@internal/contracts';
import { createApiClient } from '@internal/network';

// Initial headless AuthMachine setup with hardware biometrics support
const storage = new InMemorySecureStorage();
const authMachine = new AuthMachine({
  storage,
  requestOtpApi: async (phone) => {
    console.log(`[Auth] OTP requested for ${phone}`);
  },
  verifyOtpApi: async (phone, code) => {
    return {
      user: {
        userId: 'user_viewer_01',
        phoneNumber: phone,
        status: 'active',
        displayName: 'Vikram',
      },
      accessToken: 'sample_jwt_access_token',
      refreshToken: 'sample_jwt_refresh_token',
    };
  },
  verifyBiometricsApi: async () => {
    const result = await nativeBridge.authenticate('Scan fingerprint or use FaceID to unlock');
    return result.success;
  },
});

export function MainScreen() {
  const theme = useTheme();
  const session = useSession();

  const [feed, setFeed] = useState<HomeFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal Sheet State
  const [activeSheet, setActiveSheet] = useState<'wave' | 'scene' | 'quest' | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<KindredCardVM | null>(null);
  const [selectedScene, setSelectedScene] = useState<SceneSummaryVM | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<QuestInviteVM | null>(null);
  const [waveMessage, setWaveMessage] = useState('');
  const [waveSent, setWaveSent] = useState(false);

  const signalTriggerRef = useRef<FocusableTarget | null>(null);

  // Initialize Network client targeting local NestJS BFF
  const apiClient = useMemo(
    () =>
      createApiClient({
        baseURL: 'http://localhost:4000',
        clientInfo: {
          appVersion: '1.0.0',
          uiKitVersion: '1.0.0',
          platform: 'ios',
        },
      }),
    []
  );

  useEffect(() => {
    async function loadFeed() {
      try {
        // Try fetching from local BFF; fall back gracefully if offline
        const res = await apiClient.get<HomeFeedResponse>('v1/feed/home', {
          headers: { 'x-dev-user-id': 'user_viewer_01' },
          skipAuth: true,
        });
        setFeed(res);
      } catch (err) {
        console.log('[Feed] Offline fallback state:', err);
        // Fallback embedded demonstration state
        setFeed({
          schemaVersion: 3,
          generatedAt: new Date().toISOString(),
          sections: [
            {
              id: 'scenes',
              type: 'scenes',
              component: 'SceneCarousel',
              title: 'Live Scenes Happening Now',
              items: [
                {
                  sceneId: 'scene_indie_fusion_blr',
                  title: 'Indie Fusion Acoustic Session',
                  subtitle: 'Live classical fusion in Indiranagar',
                  venueName: 'The Humming Tree Roastery',
                  distanceMeters: 650,
                  liveCount: 16,
                  startsAt: new Date().toISOString(),
                  endsAt: new Date(Date.now() + 10800000).toISOString(),
                  a11y: {
                    label: 'Indie Fusion Acoustic Session at The Humming Tree Roastery. 16 people present now.',
                    hint: 'Double tap to check into Scene',
                  },
                },
              ],
            },
            {
              id: 'quests',
              type: 'quests',
              component: 'QuestStack',
              title: 'Collaborative Co-Op Quests',
              items: [
                {
                  questId: 'quest_natya_sangeet_70s',
                  title: 'Curate 70s Marathi Natya Sangeet Playlist',
                  themeNiche: 'Indian Classical Theatre',
                  crewCount: 4,
                  hoursLeft: 42,
                  a11y: {
                    label: 'Co-Op Quest: Curate 70s Marathi Natya Sangeet Playlist. 4 of 6 crew members collaborating. 42 hours remaining.',
                    hint: 'Double tap to open quest board',
                  },
                },
              ],
            },
            {
              id: 'kindred',
              type: 'kindred',
              component: 'KindredList',
              title: 'Kindred Alignment (Zero Swipes)',
              items: [
                {
                  userId: 'user_asha',
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
                    text: 'Deep alignment in Carnatic Violin (Depth 5/5)',
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
                    label: 'Asha, 28. Shared interest in Carnatic Violin.',
                    hint: 'Double tap to send wave',
                  },
                },
              ],
            },
          ],
          pagination: { nextCursor: null },
          meta: { degraded: [], requestId: 'req_local_fallback' },
        });
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [apiClient]);

  const handleOpenSignalComposer = (candidate: KindredCardVM) => {
    setSelectedCandidate(candidate);
    setWaveMessage('');
    setWaveSent(false);
    setActiveSheet('wave');
  };

  const handleSelectScene = (scene: SceneSummaryVM) => {
    setSelectedScene(scene);
    setActiveSheet('scene');
  };

  const handleJoinQuest = (quest: QuestInviteVM) => {
    setSelectedQuest(quest);
    setActiveSheet('quest');
  };

  const handleSendWave = () => {
    setWaveSent(true);
    setTimeout(() => {
      setActiveSheet(null);
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.borderSubtle }]}>
        <View>
          <Text variant="title1" color={theme.colors.textPrimary}>
            Resonance
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Swipe-Free · Situational & Cultural Dating
          </Text>
        </View>

        <View style={[styles.locationBadge, { backgroundColor: theme.colors.surfaceElevated }]}>
          <Text variant="caption" color={theme.colors.primary} style={styles.badgeText}>
            Indiranagar, BLR
          </Text>
        </View>
      </View>

      {/* Main Feed Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text variant="callout" color={theme.colors.textSecondary}>
              Finding kindred alignments...
            </Text>
          </View>
        ) : (
          feed?.sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              onSendSignal={handleOpenSignalComposer}
              onSelectScene={handleSelectScene}
              onJoinQuest={handleJoinQuest}
            />
          ))
        )}
      </ScrollView>

      {/* Accessible Slide-Up Panel for Cultural Wave Composer */}
      {selectedCandidate && (
        <SlideUpPanel
          visible={activeSheet === 'wave'}
          onDismiss={() => setActiveSheet(null)}
          title={`Wave to ${selectedCandidate.displayName}`}
          returnFocusRef={signalTriggerRef}
          snapPoints={[0.65, 0.9]}
          testID="wave-composer-sheet"
        >
          <View style={styles.sheetBody}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Start a conversation anchored in shared niche:{' '}
              <Text variant="callout" color={theme.colors.primary}>
                {selectedCandidate.hook.text}
              </Text>
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderStrong,
                  color: theme.colors.textPrimary,
                  borderRadius: theme.radii.sm,
                },
              ]}
              placeholder="E.g., What is your favorite Lalgudi varnam or raga to listen to at dawn?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={4}
              value={waveMessage}
              onChangeText={setWaveMessage}
              accessible
              accessibilityLabel="Contextual Wave message input"
              accessibilityHint="Type your message responding to shared cultural interests"
            />

            <Button
              label={waveSent ? '✦ Wave Sent!' : 'Send Cultural Wave'}
              onPress={handleSendWave}
              disabled={waveSent || waveMessage.trim().length === 0}
              variant="primary"
            />
          </View>
        </SlideUpPanel>
      )}

      {/* Accessible Slide-Up Panel for Scene Check-In */}
      {selectedScene && (
        <SlideUpPanel
          visible={activeSheet === 'scene'}
          onDismiss={() => setActiveSheet(null)}
          title={selectedScene.title}
          snapPoints={[0.55]}
          testID="scene-checkin-sheet"
        >
          <View style={styles.sheetBody}>
            <Text variant="body" color={theme.colors.textPrimary}>
              Venue: {selectedScene.venueName}
            </Text>
            <Text variant="callout" color={theme.colors.primary}>
              ● {selectedScene.liveCount} verified attendees co-present right now
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Check-in is verified via geofence + venue QR. Your raw coordinates are discarded immediately; only Scene co-presence is shared for the next 6 hours.
            </Text>
            <Button
              label="Verify Geofenced Check-In"
              onPress={() => setActiveSheet(null)}
              variant="primary"
            />
          </View>
        </SlideUpPanel>
      )}

      {/* Accessible Slide-Up Panel for Collaborative Quest Board */}
      {selectedQuest && (
        <SlideUpPanel
          visible={activeSheet === 'quest'}
          onDismiss={() => setActiveSheet(null)}
          title={selectedQuest.title}
          snapPoints={[0.6]}
          testID="quest-board-sheet"
        >
          <View style={styles.sheetBody}>
            <Text variant="caption" color={theme.colors.accent}>
              ✦ Theme: {selectedQuest.themeNiche}
            </Text>
            <Text variant="body" color={theme.colors.textSecondary}>
              Work asynchronously with your crew of {selectedQuest.crewCount} to curate the playlist. Photos reveal progressively. Exchange mutual Kudos at the end to match!
            </Text>
            <Button
              label="Enter Quest Workspace"
              onPress={() => setActiveSheet(null)}
              variant="primary"
            />
          </View>
        </SlideUpPanel>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <I18nProvider initialLanguage="mr">
        <A11yProvider>
          <ThemeProvider>
            <PortalHost>
              <AuthProvider machine={authMachine}>
                <ToastProvider>
                  <PrivacyProtector>
                    <A11yIsolationRoot>
                      <MultiNavigator initialRoute="MEDICAL" />
                    </A11yIsolationRoot>
                  </PrivacyProtector>
                </ToastProvider>
              </AuthProvider>
            </PortalHost>
          </ThemeProvider>
        </A11yProvider>
      </I18nProvider>
    </GlobalErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  locationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  sheetBody: {
    gap: 16,
    paddingTop: 8,
  },
  textInput: {
    minHeight: 90,
    padding: 12,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 15,
  },
});
