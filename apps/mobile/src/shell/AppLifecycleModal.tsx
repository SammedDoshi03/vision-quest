import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Linking } from 'react-native';
import { TEST_LOCATORS } from '@internal/contracts';

export type LifecycleModalType = 'FORCE_UPDATE' | 'SOFT_UPDATE' | 'MAINTENANCE' | 'RATING_PROMPT' | null;

export interface AppLifecycleModalProps {
  type: LifecycleModalType;
  latestVersion?: string;
  storeUrl?: string;
  maintenanceMessage?: string;
  onDismiss: () => void;
  onSubmitRating?: (stars: number) => void;
}

export function AppLifecycleModal({
  type,
  latestVersion = '2.0.0',
  storeUrl = 'https://play.google.com/store/apps/details?id=com.resonance.mobile',
  maintenanceMessage = 'Scheduled server upgrade in progress. Offline local services remain active.',
  onDismiss,
  onSubmitRating,
}: AppLifecycleModalProps) {
  const [selectedStars, setSelectedStars] = useState<number>(5);

  if (!type) return null;

  const isForceUpdate = type === 'FORCE_UPDATE';
  const isSoftUpdate = type === 'SOFT_UPDATE';
  const isMaintenance = type === 'MAINTENANCE';
  const isRating = type === 'RATING_PROMPT';

  const handleOpenStore = () => {
    Linking.openURL(storeUrl).catch(() => {});
  };

  const handleRateSubmit = () => {
    onSubmitRating?.(selectedStars);
    onDismiss();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={true}
      onRequestClose={isForceUpdate ? () => {} : onDismiss}
      testID="app-lifecycle-modal"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Icon */}
          <Text style={styles.icon}>
            {isForceUpdate ? '🚨' : isSoftUpdate ? '✨' : isMaintenance ? '🛠️' : '⭐'}
          </Text>

          {/* Title */}
          <Text style={styles.title}>
            {isForceUpdate
              ? 'Update Required'
              : isSoftUpdate
              ? 'New Version Available'
              : isMaintenance
              ? 'Maintenance Window'
              : 'Enjoying the Platform?'}
          </Text>

          {/* Description */}
          <Text style={styles.body}>
            {isForceUpdate
              ? `Version ${latestVersion} is required to continue using network services with latest security & regulatory compliance.`
              : isSoftUpdate
              ? `Version ${latestVersion} is now available with bilingual enhancements and faster offline sync.`
              : isMaintenance
              ? maintenanceMessage
              : 'Help us improve by giving a rating. Your feedback shapes the future of this platform!'}
          </Text>

          {/* In-App 5-Star Rating Selector */}
          {isRating && (
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setSelectedStars(star)}
                  style={styles.starBtn}
                  accessibilityLabel={`${star} stars`}
                >
                  <Text style={[styles.starIcon, selectedStars >= star && styles.starSelected]}>
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {isSoftUpdate && (
              <Pressable style={styles.secondaryBtn} onPress={onDismiss}>
                <Text style={styles.secondaryBtnText}>Later</Text>
              </Pressable>
            )}

            {isRating && (
              <Pressable style={styles.secondaryBtn} onPress={onDismiss}>
                <Text style={styles.secondaryBtnText}>No Thanks</Text>
              </Pressable>
            )}

            {(isForceUpdate || isSoftUpdate) && (
              <Pressable style={styles.primaryBtn} onPress={handleOpenStore}>
                <Text style={styles.primaryBtnText}>Update Now</Text>
              </Pressable>
            )}

            {isRating && (
              <Pressable style={styles.primaryBtn} onPress={handleRateSubmit}>
                <Text style={styles.primaryBtnText}>Submit Rating</Text>
              </Pressable>
            )}

            {isMaintenance && (
              <Pressable style={styles.primaryBtn} onPress={onDismiss}>
                <Text style={styles.primaryBtnText}>Continue Offline</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  starBtn: {
    padding: 4,
  },
  starIcon: {
    fontSize: 32,
    color: '#334155',
  },
  starSelected: {
    color: '#F59E0B',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 15,
  },
});
