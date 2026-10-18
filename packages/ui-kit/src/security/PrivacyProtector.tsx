import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';

export interface PrivacyProtectorProps {
  children: React.ReactNode;
  enabled?: boolean;
  shieldTitle?: string;
  shieldSubtitle?: string;
  shieldIcon?: string;
}

/**
 * PrivacyProtector covers the view with a security shield whenever the app
 * enters the background or multitasking app switcher, preventing sensitive
 * balances, medical data, or chats from leaking in OS snapshots.
 */
export function PrivacyProtector({
  children,
  enabled = true,
  shieldTitle = 'Confidential Session Shielded',
  shieldSubtitle = 'Return to the application to resume viewing sensitive data.',
  shieldIcon = '🛡️',
}: PrivacyProtectorProps) {
  const [isBackgrounded, setIsBackgrounded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      // 'inactive' on iOS represents app switcher; 'background' on Android represents backgrounded
      const shouldShield = nextState === 'inactive' || nextState === 'background';
      setIsBackgrounded(shouldShield);
    });

    return () => {
      subscription.remove();
    };
  }, [enabled]);

  return (
    <View style={styles.root}>
      {children}

      {enabled && isBackgrounded && (
        <View style={styles.shieldOverlay} testID="privacy-shield-overlay">
          <View style={styles.shieldCard}>
            <Text style={styles.shieldIcon}>{shieldIcon}</Text>
            <Text style={styles.shieldTitle}>{shieldTitle}</Text>
            <Text style={styles.shieldSubtitle}>{shieldSubtitle}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  shieldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617',
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  shieldCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: 360,
    width: '100%',
  },
  shieldIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  shieldTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  shieldSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
