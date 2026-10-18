import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import { PatientTheme } from './themes';

export interface AccessiblePatientButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  accessibilityHint?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export function AccessiblePatientButton({
  label,
  onPress,
  variant = 'primary',
  accessibilityHint,
  accessibilityLabel,
  style,
  disabled = false,
}: AccessiblePatientButtonProps) {
  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return '#9CA3AF';
    switch (variant) {
      case 'success':
        return pressed ? '#166534' : PatientTheme.colors.taken;
      case 'danger':
        return pressed ? '#991B1B' : PatientTheme.colors.emergencyButton;
      case 'secondary':
        return pressed ? '#E5E7EB' : PatientTheme.colors.cardBackground;
      case 'primary':
      default:
        return pressed ? '#1D4ED8' : '#2563EB';
    }
  };

  const getTextColor = (): TextStyle => {
    if (variant === 'secondary') {
      return { color: PatientTheme.colors.textPrimary };
    }
    return { color: '#FFFFFF' };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: variant === 'secondary' ? PatientTheme.colors.cardBorder : 'transparent',
        },
        style,
      ]}
    >
      <Text style={[styles.label, getTextColor()]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: PatientTheme.touchTarget.minHeight,
    minWidth: PatientTheme.touchTarget.minWidth,
    borderRadius: PatientTheme.touchTarget.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: PatientTheme.typography.bodyLarge.fontSize,
    fontWeight: PatientTheme.typography.bodyLarge.fontWeight,
    textAlign: 'center',
  },
});
