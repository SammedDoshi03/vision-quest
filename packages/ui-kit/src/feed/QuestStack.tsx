import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import type { QuestStackSection, QuestInviteVM } from '@internal/contracts';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';

export interface QuestStackProps {
  section: QuestStackSection;
  onJoinQuest: (quest: QuestInviteVM) => void;
}

export function QuestStack({ section, onJoinQuest }: QuestStackProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="title3" color={theme.colors.textPrimary} style={styles.title}>
        {section.title}
      </Text>

      {section.items.map((quest) => (
        <Pressable
          key={quest.questId}
          onPress={() => onJoinQuest(quest)}
          style={({ pressed }) => [
            styles.questCard,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: 'rgba(139, 92, 246, 0.3)',
              borderRadius: theme.radii.md,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={quest.a11y.label}
          accessibilityHint={quest.a11y.hint}
        >
          <View style={styles.questHeader}>
            <Text variant="caption" color={theme.colors.accent} style={styles.themeTag}>
              ✦ {quest.themeNiche}
            </Text>
            <Text variant="caption" color={theme.colors.textMuted}>
              {quest.hoursLeft}h left
            </Text>
          </View>
          <Text variant="callout" color={theme.colors.textPrimary} style={styles.questTitle}>
            {quest.title}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Crew: {quest.crewCount}/6 members collaborating
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  title: {
    marginBottom: 4,
  },
  questCard: {
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeTag: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  questTitle: {
    fontWeight: '600',
  },
});
