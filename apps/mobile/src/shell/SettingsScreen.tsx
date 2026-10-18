import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useI18n } from '@internal/ui-kit';

export function SettingsScreen() {
  const { language, setLanguage } = useI18n();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [textScale, setTextScale] = useState<1.0 | 1.25 | 1.5>(1.25);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      Alert.alert(
        'App Version Status',
        'Current Version: 1.0.0\nLatest Available: 1.1.0\n\nA new update with improved Marathi audio prompts is ready on the App Store!',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Update Now', onPress: () => Linking.openURL('https://apps.apple.com') },
        ]
      );
    }, 600);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Enjoying the Experience?',
      'Your feedback helps us make medication adherence and health tracking simpler for families.',
      [
        { text: 'Not Now', style: 'cancel' },
        {
          text: 'Rate 5 Stars ⭐⭐⭐⭐⭐',
          onPress: () => Alert.alert('Thank You!', 'Thank you for supporting our healthcare companion!'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Application Settings</Text>

      {/* Language Preferences */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>🌐 Language / भाषा</Text>
        <View style={styles.langButtonRow}>
          <Pressable
            style={[styles.langChip, language === 'mr' && styles.langChipActive]}
            onPress={() => setLanguage('mr')}
          >
            <Text style={[styles.langChipText, language === 'mr' && styles.langChipTextActive]}>
              मराठी (Marathi)
            </Text>
          </Pressable>
          <Pressable
            style={[styles.langChip, language === 'en' && styles.langChipActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langChipText, language === 'en' && styles.langChipTextActive]}>
              English
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Accessibility & Legibility */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>👁️ Accessibility & Display</Text>
        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>High-Contrast AAA Mode</Text>
            <Text style={styles.itemSubtitle}>Maximizes 14:1 contrast ratio for elderly users</Text>
          </View>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>

        <View style={styles.divider} />

        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>Text Size Scaling</Text>
            <Text style={styles.itemSubtitle}>Current: {textScale}x display scale</Text>
          </View>
          <View style={styles.scaleButtonsRow}>
            {([1.0, 1.25, 1.5] as const).map((scale) => (
              <Pressable
                key={scale}
                style={[styles.scalePill, textScale === scale && styles.scalePillActive]}
                onPress={() => setTextScale(scale)}
              >
                <Text style={[styles.scaleText, textScale === scale && styles.scaleTextActive]}>
                  {scale}x
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Security & Notifications */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>🔒 Security & Alarms</Text>
        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>Exact Alarms & Notifications</Text>
            <Text style={styles.itemSubtitle}>High-importance Android Doze override</Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>

        <View style={styles.divider} />

        <View style={styles.rowItem}>
          <View>
            <Text style={styles.itemTitle}>Biometric Lock (FaceID / Fingerprint)</Text>
            <Text style={styles.itemSubtitle}>Require authentication on app resume</Text>
          </View>
          <Switch value={biometricsEnabled} onValueChange={setBiometricsEnabled} />
        </View>
      </View>

      {/* Maintenance, OTA & Feedback */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>🚀 Updates & Support</Text>
        <Pressable style={styles.actionRow} onPress={handleCheckUpdate}>
          <Text style={styles.actionRowText}>
            {isCheckingUpdate ? 'Checking for updates...' : 'Check for App Updates (OTA / Store)'}
          </Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.actionRow} onPress={handleRateApp}>
          <Text style={styles.actionRowText}>Rate & Review Our App ⭐</Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  langButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  langChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  langChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  langChipTextActive: {
    color: '#FFFFFF',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 240,
  },
  scaleButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scalePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  scalePillActive: {
    backgroundColor: '#0F766E',
  },
  scaleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  scaleTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionRowText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
});
