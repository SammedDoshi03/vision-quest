import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { a11y } from '@internal/a11y';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';

export interface IconButtonProps {
  /** Required: every icon button must have a screen reader accessible label */
  accessibilityLabel: string;
  icon: string | React.ReactNode;
  onPress: () => void;
  hint?: string;
  disabled?: boolean;
  size?: number;
  testID?: string;
  style?: ViewStyle;
}

export function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  hint,
  disabled = false,
  size = 44,
  testID,
  style,
}: IconButtonProps) {
  const theme = useTheme();

  const a11yProps = a11y.button({
    label: accessibilityLabel,
    hint,
    disabled,
  });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      {...a11yProps}
      style={({ pressed }) => [
        styles.base,
        {
          width: Math.max(size, 44),
          height: Math.max(size, 44),
          borderRadius: theme.radii.full,
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {typeof icon === 'string' ? (
        <Text variant="callout" color={theme.colors.textPrimary}>
          {icon}
        </Text>
      ) : (
        icon
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
