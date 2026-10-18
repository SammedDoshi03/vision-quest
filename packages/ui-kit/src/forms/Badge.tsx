import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  onDismiss?: () => void;
  testID?: string;
}

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: '#1E293B', text: '#38BDF8', border: '#334155' },
  success: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: '#10B981' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: '#F59E0B' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: '#EF4444' },
  info: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: '#38BDF8' },
  neutral: { bg: '#1E293B', text: '#94A3B8', border: '#475569' },
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onDismiss,
  testID = 'badge',
}: BadgeProps) {
  const colors = BADGE_COLORS[variant];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        size === 'sm' && styles.sizeSm,
        size === 'md' && styles.sizeMd,
        size === 'lg' && styles.sizeLg,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.label,
          { color: colors.text },
          size === 'sm' && styles.labelSm,
          size === 'lg' && styles.labelLg,
        ]}
      >
        {label}
      </Text>
      {onDismiss && (
        <Pressable
          style={styles.dismissBtn}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Text style={[styles.dismissText, { color: colors.text }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  marginVertical?: number;
}

export function Divider({
  label,
  orientation = 'horizontal',
  marginVertical = 16,
}: DividerProps) {
  if (orientation === 'vertical') {
    return <View style={styles.verticalDivider} />;
  }

  if (label) {
    return (
      <View style={[styles.labeledDividerContainer, { marginVertical }]}>
        <View style={styles.line} />
        <Text style={styles.dividerLabel}>{label}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.line, { marginVertical }]} />;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sizeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sizeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sizeLg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelSm: {
    fontSize: 10,
  },
  labelLg: {
    fontSize: 14,
  },
  dismissBtn: {
    marginLeft: 6,
    padding: 2,
  },
  dismissText: {
    fontSize: 11,
    fontWeight: '800',
  },
  line: {
    height: 1,
    backgroundColor: '#334155',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#334155',
    alignSelf: 'stretch',
    marginHorizontal: 12,
  },
  labeledDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLabel: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
});
