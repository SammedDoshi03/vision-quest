import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';

export interface ChipProps {
  label: string;
  emphasis?: 'rare' | 'common';
  depth?: number;
  style?: ViewStyle;
}

export function Chip({ label, emphasis = 'common', depth, style }: ChipProps) {
  const theme = useTheme();

  const isRare = emphasis === 'rare';
  const bgColor = isRare ? 'rgba(224, 86, 56, 0.16)' : 'rgba(255, 255, 255, 0.08)';
  const textColor = isRare ? theme.colors.primary : theme.colors.textSecondary;
  const borderColor = isRare ? theme.colors.primary : theme.colors.borderSubtle;

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: bgColor,
          borderColor,
          borderRadius: theme.radii.full,
          paddingHorizontal: theme.space.sm + 4,
          paddingVertical: theme.space.xs,
        },
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}${isRare ? ', rare niche' : ''}${depth ? `, depth ${depth} of 5` : ''}`}
    >
      <Text variant="caption" color={textColor} style={styles.text}>
        {label}
        {depth ? ` (${depth}★)` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    fontWeight: '500',
  },
});
