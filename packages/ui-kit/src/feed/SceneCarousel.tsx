import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import type { SceneCarouselSection, SceneSummaryVM } from '@internal/contracts';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';

export interface SceneCarouselProps {
  section: SceneCarouselSection;
  onSelectScene: (scene: SceneSummaryVM) => void;
}

export function SceneCarousel({ section, onSelectScene }: SceneCarouselProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="title3" color={theme.colors.textPrimary} style={styles.title}>
        {section.title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {section.items.map((scene) => (
          <Pressable
            key={scene.sceneId}
            onPress={() => onSelectScene(scene)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.colors.surfaceCard,
                borderColor: theme.colors.borderStrong,
                borderRadius: theme.radii.md,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={scene.a11y.label}
            accessibilityHint={scene.a11y.hint}
          >
            <View style={styles.badgeRow}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.primary }]} />
              <Text variant="caption" color={theme.colors.primary} style={styles.liveText}>
                {scene.liveCount} present now
              </Text>
            </View>

            <Text variant="callout" color={theme.colors.textPrimary} style={styles.sceneTitle}>
              {scene.title}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {scene.venueName}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  title: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    padding: 14,
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontWeight: '600',
  },
  sceneTitle: {
    fontWeight: '600',
  },
});
