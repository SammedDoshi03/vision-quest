import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { CaregiverAlert } from '@internal/contracts';
import { CaregiverTheme } from './themes';
import { useI18n } from '../i18n';

export interface AlertTickerItemProps {
  alert: CaregiverAlert;
  onCallPatient: (patientId: string) => void;
  onAcknowledge: (alertId: string) => void;
}

export function AlertTickerItem({
  alert,
  onCallPatient,
  onAcknowledge,
}: AlertTickerItemProps) {
  const { language, t } = useI18n();

  const isCritical = alert.severity === 'CRITICAL';
  const message = (language === 'mr' && alert.messageMr) ? alert.messageMr : alert.message;

  return (
    <View
      style={[
        styles.card,
        isCritical && styles.criticalCard,
      ]}
      accessible={true}
      accessibilityLabel={`Alert: ${message}`}
    >
      <View style={styles.contentRow}>
        <View style={styles.indicatorContainer}>
          <Text style={styles.badgeIcon}>{isCritical ? '⚠️' : 'ℹ️'}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.patientName}>{alert.patientName}</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.callButton}
          onPress={() => onCallPatient(alert.patientId)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('action.call_patient', 'Call Patient')}
        >
          <Text style={styles.callButtonText}>📞 {t('action.call_patient', 'Call Patient')}</Text>
        </Pressable>

        {!alert.acknowledged && (
          <Pressable
            style={styles.ackButton}
            onPress={() => onAcknowledge(alert.alertId)}
            accessible={true}
            accessibilityRole="button"
          >
            <Text style={styles.ackButtonText}>Dismiss</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  criticalCard: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  indicatorContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  badgeIcon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: CaregiverTheme.colors.textPrimary,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#991B1B',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ackButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ackButtonText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
