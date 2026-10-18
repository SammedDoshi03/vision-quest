import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { MedicationSchedule } from '@internal/contracts';
import { PatientTheme } from './themes';
import { AccessiblePatientButton } from './AccessiblePatientButton';
import { useI18n } from '../i18n';

export interface MedicationCardProps {
  schedule: MedicationSchedule;
  onMarkTaken: (scheduleId: string) => void;
  onSnooze?: (scheduleId: string) => void;
}

export function MedicationCard({
  schedule,
  onMarkTaken,
  onSnooze,
}: MedicationCardProps) {
  const { language, t } = useI18n();

  const isMarathi = language === 'mr';
  const medicineName = (isMarathi && schedule.medicineNameMr) ? schedule.medicineNameMr : schedule.medicineName;
  const dosage = (isMarathi && schedule.dosageMr) ? schedule.dosageMr : schedule.dosage;

  const isDueNow = schedule.status === 'DUE_NOW';
  const isTaken = schedule.status === 'TAKEN';
  const isMissed = schedule.status === 'MISSED';

  const getStatusBadge = () => {
    switch (schedule.status) {
      case 'DUE_NOW':
        return {
          label: t('reminders.due_now', 'Due Now'),
          bg: PatientTheme.colors.dueNowBg,
          text: PatientTheme.colors.dueNow,
          border: PatientTheme.colors.dueNow,
        };
      case 'TAKEN':
        return {
          label: t('reminders.taken', 'Taken'),
          bg: PatientTheme.colors.takenBg,
          text: PatientTheme.colors.taken,
          border: PatientTheme.colors.taken,
        };
      case 'MISSED':
        return {
          label: t('reminders.missed', 'Missed'),
          bg: '#FEE2E2',
          text: '#991B1B',
          border: '#DC2626',
        };
      case 'UPCOMING':
      default:
        return {
          label: t('reminders.upcoming', 'Upcoming'),
          bg: PatientTheme.colors.upcomingBg,
          text: PatientTheme.colors.upcoming,
          border: '#9CA3AF',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <View
      style={[
        styles.card,
        isDueNow && styles.dueNowBorder,
        isTaken && styles.takenBorder,
      ]}
      accessible={true}
      accessibilityLabel={`${medicineName}, ${dosage}, scheduled for ${schedule.scheduledTime}, status: ${badge.label}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{schedule.scheduledTime}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <Text style={styles.medicineTitle}>{medicineName}</Text>
      <Text style={styles.dosageSubtitle}>{dosage}</Text>

      {isDueNow && (
        <View style={styles.actionContainer}>
          <AccessiblePatientButton
            label={`✓ ${t('action.take_it', 'I Took It')}`}
            variant="success"
            onPress={() => onMarkTaken(schedule.id)}
            accessibilityHint="Confirm you have swallowed this dose"
          />
          {onSnooze && (
            <Pressable
              style={styles.snoozeButton}
              onPress={() => onSnooze(schedule.id)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('action.snooze', 'Remind in 10 Mins')}
            >
              <Text style={styles.snoozeText}>{t('action.snooze', 'Remind in 10 Mins')}</Text>
            </Pressable>
          )}
        </View>
      )}

      {isTaken && (
        <View style={styles.takenNotice}>
          <Text style={styles.takenNoticeText}>✓ {t('reminders.taken', 'Taken')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PatientTheme.colors.cardBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: PatientTheme.colors.cardBorder,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dueNowBorder: {
    borderColor: PatientTheme.colors.dueNow,
    borderWidth: 3,
    backgroundColor: '#FFF5F5',
  },
  takenBorder: {
    borderColor: PatientTheme.colors.taken,
    backgroundColor: '#F0FDF4',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeContainer: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeText: {
    fontSize: PatientTheme.typography.bodyLarge.fontSize,
    fontWeight: '700',
    color: PatientTheme.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  statusBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  medicineTitle: {
    fontSize: PatientTheme.typography.headline.fontSize,
    fontWeight: '800',
    color: PatientTheme.colors.textPrimary,
    lineHeight: 32,
    marginBottom: 4,
  },
  dosageSubtitle: {
    fontSize: PatientTheme.typography.bodyLarge.fontSize,
    color: PatientTheme.colors.textSecondary,
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 8,
    gap: 12,
  },
  snoozeButton: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snoozeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4B5563',
    textDecorationLine: 'underline',
  },
  takenNotice: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  takenNoticeText: {
    fontSize: 20,
    fontWeight: '700',
    color: PatientTheme.colors.taken,
  },
});
