import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CaregiverTheme } from './themes';
import { useI18n } from '../i18n';

export interface AdherenceTrackerCardProps {
  patientName: string;
  adherenceRatePercent: number;
  takenCount: number;
  totalScheduled: number;
  missedCount: number;
}

export function AdherenceTrackerCard({
  patientName,
  adherenceRatePercent,
  takenCount,
  totalScheduled,
  missedCount,
}: AdherenceTrackerCardProps) {
  const { t } = useI18n();

  const isGood = adherenceRatePercent >= 80;

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityLabel={`${patientName}'s adherence is ${adherenceRatePercent}%, ${takenCount} of ${totalScheduled} doses taken.`}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.patientLabel}>{t('caregiver.patient_paired', 'Monitored Patient')}</Text>
          <Text style={styles.patientName}>{patientName}</Text>
        </View>
        <View
          style={[
            styles.percentPill,
            {
              backgroundColor: isGood ? CaregiverTheme.colors.successBg : CaregiverTheme.colors.warningBg,
            },
          ]}
        >
          <Text
            style={[
              styles.percentText,
              {
                color: isGood ? CaregiverTheme.colors.successBadge : CaregiverTheme.colors.warningBadge,
              },
            ]}
          >
            {adherenceRatePercent}%
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricNumber}>{takenCount}</Text>
          <Text style={styles.metricLabel}>{t('reminders.taken', 'Taken')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricNumber}>{missedCount}</Text>
          <Text style={[styles.metricLabel, missedCount > 0 && styles.missedLabel]}>
            {t('reminders.missed', 'Missed')}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricNumber}>{totalScheduled}</Text>
          <Text style={styles.metricLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CaregiverTheme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CaregiverTheme.colors.border,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: CaregiverTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  patientName: {
    fontSize: CaregiverTheme.typography.title.fontSize,
    fontWeight: CaregiverTheme.typography.title.fontWeight,
    color: CaregiverTheme.colors.textPrimary,
    marginTop: 2,
  },
  percentPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: CaregiverTheme.colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: CaregiverTheme.colors.textSecondary,
    marginTop: 2,
  },
  missedLabel: {
    color: CaregiverTheme.colors.criticalBadge,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});
