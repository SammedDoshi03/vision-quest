import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface UniversalEntityCardProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: {
    label: string;
    variant: 'success' | 'warning' | 'critical' | 'neutral';
  };
  metadata?: Array<{ label: string; value: string }>;
  primaryAction?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'success' | 'danger';
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  isElderlyAccessible?: boolean;
}

export function UniversalEntityCard({
  title,
  subtitle,
  eyebrow,
  badge,
  metadata = [],
  primaryAction,
  secondaryAction,
  isElderlyAccessible = false,
}: UniversalEntityCardProps) {
  const getBadgeStyle = () => {
    switch (badge?.variant) {
      case 'success':
        return { bg: '#DCFCE7', text: '#15803D', border: '#16A34A' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#B45309', border: '#D97706' };
      case 'critical':
        return { bg: '#FEE2E2', text: '#B91C1C', border: '#DC2626' };
      case 'neutral':
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View
      style={[
        styles.card,
        isElderlyAccessible && styles.accessibleCard,
      ]}
      accessible={true}
      accessibilityLabel={`${title}, ${subtitle || ''}, ${badge ? badge.label : ''}`}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : <View />}
        {badge && (
          <View
            style={[
              styles.badgePill,
              { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border },
            ]}
          >
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
              {badge.label}
            </Text>
          </View>
        )}
      </View>

      {/* Main Content */}
      <Text style={[styles.title, isElderlyAccessible && styles.accessibleTitle]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, isElderlyAccessible && styles.accessibleSubtitle]}>
          {subtitle}
        </Text>
      ) : null}

      {/* Optional Metadata Row */}
      {metadata.length > 0 && (
        <View style={styles.metadataRow}>
          {metadata.map((item, idx) => (
            <View key={idx} style={styles.metadataItem}>
              <Text style={styles.metaLabel}>{item.label}</Text>
              <Text style={styles.metaValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Footer */}
      {(primaryAction || secondaryAction) && (
        <View style={styles.actionRow}>
          {secondaryAction && (
            <Pressable
              style={styles.secondaryButton}
              onPress={secondaryAction.onPress}
              accessible={true}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>{secondaryAction.label}</Text>
            </Pressable>
          )}
          {primaryAction && (
            <Pressable
              style={[
                styles.primaryButton,
                isElderlyAccessible && styles.accessibleButton,
                primaryAction.variant === 'success' && styles.successButton,
                primaryAction.variant === 'danger' && styles.dangerButton,
              ]}
              onPress={primaryAction.onPress}
              accessible={true}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accessibleCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  accessibleTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  accessibleSubtitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metadataItem: {
    minWidth: 80,
  },
  metaLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessibleButton: {
    minHeight: 64,
    minWidth: 140,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  successButton: {
    backgroundColor: '#15803D',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
});
