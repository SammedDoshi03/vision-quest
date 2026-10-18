import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type AlertBannerVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertBannerProps {
  variant?: AlertBannerVariant;
  title: string;
  description?: string;
  icon?: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  testID?: string;
}

const ALERT_CONFIG: Record<
  AlertBannerVariant,
  { bg: string; border: string; text: string; subText: string; defaultIcon: string }
> = {
  success: {
    bg: '#064E3B',
    border: '#10B981',
    text: '#ECFDF5',
    subText: '#A7F3D0',
    defaultIcon: '✓',
  },
  warning: {
    bg: '#78350F',
    border: '#F59E0B',
    text: '#FFFBEB',
    subText: '#FDE68A',
    defaultIcon: '⚠️',
  },
  error: {
    bg: '#7F1D1D',
    border: '#EF4444',
    text: '#FEF2F2',
    subText: '#FECACA',
    defaultIcon: '🚨',
  },
  info: {
    bg: '#0C4A6E',
    border: '#38BDF8',
    text: '#F0F9FF',
    subText: '#BAE6FD',
    defaultIcon: 'ℹ️',
  },
};

export function AlertBanner({
  variant = 'info',
  title,
  description,
  icon,
  onDismiss,
  action,
  testID = 'alert-banner',
}: AlertBannerProps) {
  const config = ALERT_CONFIG[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${variant} alert: ${title}`}
      testID={testID}
    >
      <Text style={styles.icon}>{icon || config.defaultIcon}</Text>
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.text }]}>{title}</Text>
        {description && <Text style={[styles.desc, { color: config.subText }]}>{description}</Text>}
      </View>

      {action && (
        <Pressable
          style={[styles.actionBtn, { borderColor: config.border }]}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <Text style={[styles.actionBtnText, { color: config.text }]}>{action.label}</Text>
        </Pressable>
      )}

      {onDismiss && (
        <Pressable
          style={styles.dismissBtn}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
        >
          <Text style={[styles.dismissIcon, { color: config.subText }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 6,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dismissBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
});
