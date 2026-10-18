import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import type { KindredCardVM } from '@internal/contracts';
import { Text } from '../primitives/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme';

export interface KindredCardProps {
  card: KindredCardVM;
  onSendSignal: (card: KindredCardVM) => void;
}

export function KindredCard({ card, onSendSignal }: KindredCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceCard,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radii.lg,
        },
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={card.a11y.label}
      accessibilityHint={card.a11y.hint}
    >
      {/* Photo with aspect ratio */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: card.photo.uri }}
          style={[styles.image, { aspectRatio: card.photo.aspectRatio || 0.8 }]}
          accessible={false}
          accessibilityLabel={card.photo.alt}
        />
        <View style={styles.gradientOverlay} />
      </View>

      {/* Header Info */}
      <View style={[styles.content, { padding: theme.space.md }]}>
        <View style={styles.nameRow}>
          <Text variant="title2" color={theme.colors.textPrimary}>
            {card.displayName}, {card.age}
          </Text>
        </View>

        {/* Situational Hook */}
        <View
          style={[
            styles.hookContainer,
            {
              backgroundColor: 'rgba(224, 86, 56, 0.12)',
              borderColor: 'rgba(224, 86, 56, 0.28)',
              borderRadius: theme.radii.sm,
            },
          ]}
        >
          <Text variant="callout" color={theme.colors.primary} style={styles.hookText}>
            ✦ {card.hook.text}
          </Text>
        </View>

        {/* Shared Cultural Niche Tags */}
        <View style={styles.tagRow}>
          {card.sharedTags.map((tag) => (
            <Chip key={tag.id} label={tag.label} emphasis={tag.emphasis} />
          ))}
        </View>

        {/* Primary Action Button (Anti-Swipe Contextual Signal) */}
        <Button
          label={card.primaryAction.label}
          onPress={() => onSendSignal(card)}
          variant="primary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#0F1015',
    position: 'relative',
  },
  image: {
    width: '100%',
    maxHeight: 380,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(11, 12, 16, 0.4)',
  },
  content: {
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hookContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  hookText: {
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginTop: 6,
  },
});
