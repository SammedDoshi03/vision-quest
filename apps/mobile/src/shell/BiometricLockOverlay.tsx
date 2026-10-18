import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useBiometrics } from '@internal/ui-kit';
import { TEST_LOCATORS } from '@internal/contracts';

export interface BiometricLockOverlayProps {
  onUnlockSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export function BiometricLockOverlay({
  onUnlockSuccess,
  title = 'App Locked for Security',
  subtitle = 'Verify your biometric identity (FaceID / Fingerprint) to access sensitive data.',
}: BiometricLockOverlayProps) {
  const { biometricType, authenticate, isLoading, error } = useBiometrics();
  const [authError, setAuthError] = useState<string | null>(null);

  const handlePrompt = async () => {
    setAuthError(null);
    const result = await authenticate({
      promptMessage: 'Unlock platform with FaceID or Fingerprint',
      fallbackLabel: 'Use Device Passcode',
    });
    if (result.success) {
      onUnlockSuccess();
    } else {
      setAuthError(result.error || 'Authentication rejected. Please try again.');
    }
  };

  const biometricIcon = biometricType === 'FACE_ID' ? '👤' : '👆';

  return (
    <View style={styles.container} testID="biometric-lock-overlay">
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{biometricIcon}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {(authError || error) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {authError || error}</Text>
          </View>
        )}

        <Pressable
          style={styles.unlockButton}
          onPress={handlePrompt}
          disabled={isLoading}
          testID="biometric-unlock-btn"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Unlock with ${biometricType}`}
        >
          {isLoading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={styles.unlockButtonText}>
              Unlock with {biometricType === 'FACE_ID' ? 'FaceID' : 'Biometrics'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  unlockButton: {
    width: '100%',
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 16,
  },
});
