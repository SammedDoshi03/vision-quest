import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { a11y } from '@internal/a11y';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
  testID?: string;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  hint,
  testID,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const isInteractive = !disabled && !loading;

  const bgColors: Record<string, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.surfaceElevated,
    ghost: 'transparent',
  };

  const textColors: Record<string, string> = {
    primary: theme.colors.primaryForeground,
    secondary: theme.colors.textPrimary,
    ghost: theme.colors.primary,
  };

  const a11yProps = a11y.button({
    label,
    hint,
    disabled: !isInteractive,
    busy: loading,
  });

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      testID={testID}
      {...a11yProps}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgColors[variant],
          borderColor: variant === 'secondary' ? theme.colors.borderStrong : 'transparent',
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          paddingVertical: size === 'sm' ? theme.space.xs + 2 : size === 'lg' ? theme.space.md : theme.space.sm + 2,
          paddingHorizontal: size === 'sm' ? theme.space.sm : theme.space.lg,
          borderRadius: theme.radii.md,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <Text
          variant={size === 'sm' ? 'caption' : size === 'lg' ? 'title3' : 'callout'}
          color={textColors[variant]}
          style={styles.label}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48, // Meets and exceeds 44pt WCAG touch target guideline
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
