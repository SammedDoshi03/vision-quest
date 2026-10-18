import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, SafeAreaView } from 'react-native';
import { useI18n, useResponsiveLayout, UniversalDynamicPage, useHardwareBackHandler } from '@internal/ui-kit';
import {
  TEST_LOCATORS,
  DYNAMIC_DOMAINS_REGISTRY,
  DYNAMIC_ECOMMERCE_TEMPLATE,
  DYNAMIC_MEDICAL_TEMPLATE,
} from '@internal/contracts';
import { MainScreen as ResonanceFeedScreen } from '../App';
import { ReelsView, SettingsScreen } from '../shell';

export type NavigationRoute =
  | 'DYNAMIC_SDUI'
  | 'MEDICAL'
  | 'ECOMMERCE'
  | 'STREAMING'
  | 'PAYMENTS'
  | 'BANKING'
  | 'ENERGY'
  | 'PUBLIC_SECTOR'
  | 'CHAT'
  | 'DELIVERY'
  | 'STORAGE'
  | 'MOBILITY'
  | 'REELS'
  | 'RESONANCE_FEED'
  | 'ADMIN'
  | 'SETTINGS';

export interface MultiNavigatorProps {
  initialRoute?: NavigationRoute;
}

export function MultiNavigator({ initialRoute = 'DYNAMIC_SDUI' }: MultiNavigatorProps) {
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(initialRoute);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDynamicTemplate, setSelectedDynamicTemplate] = useState<'ecommerce' | 'medical'>('ecommerce');
  const { language, setLanguage } = useI18n();
  const { orientation, deviceType, isTablet, isLandscape } = useResponsiveLayout();

  // Hardware BackHandler: closes drawer if open, or returns to DYNAMIC_SDUI if on other screen
  useHardwareBackHandler(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      return true;
    }
    if (currentRoute !== 'DYNAMIC_SDUI') {
      setCurrentRoute('DYNAMIC_SDUI');
      return true;
    }
    return false;
  }, true);

  const routesList: Array<{ route: NavigationRoute; label: string; icon: string; tabTestId?: string }> = [
    { route: 'DYNAMIC_SDUI', label: '00. Universal Dynamic SDUI (Zero Hardcode)', icon: '⚡' },
    { route: 'MEDICAL', label: '01. Medical Care (Patient & Caregiver)', icon: '🏥', tabTestId: TEST_LOCATORS.NAV.TAB_MEDICAL },
    { route: 'ECOMMERCE', label: '02. E-Commerce (Shopper & Merchant)', icon: '🛍️', tabTestId: TEST_LOCATORS.NAV.TAB_ECOMMERCE },
    { route: 'STREAMING', label: '03. Streaming (Viewer & Studio)', icon: '🎬', tabTestId: TEST_LOCATORS.NAV.TAB_STREAMING },
    { route: 'PAYMENTS', label: '04. UPI Payments (P2P & Soundbox)', icon: '💳', tabTestId: TEST_LOCATORS.NAV.TAB_PAYMENTS },
    { route: 'BANKING', label: '05. Wealth Banking (Customer & AML)', icon: '🏦', tabTestId: TEST_LOCATORS.NAV.TAB_BANKING },
    { route: 'ENERGY', label: '06. Energy Grid (Lineman & Dispatcher)', icon: '⚡', tabTestId: TEST_LOCATORS.NAV.TAB_ENERGY },
    { route: 'PUBLIC_SECTOR', label: '07. 311 Grievance (Citizen & Ward)', icon: '🏛️', tabTestId: TEST_LOCATORS.NAV.TAB_PUBLIC_SECTOR },
    { route: 'CHAT', label: '08. E2E Chat (User & Moderator)', icon: '💬', tabTestId: TEST_LOCATORS.NAV.TAB_CHAT },
    { route: 'DELIVERY', label: '09. 10m Delivery (Customer & Rider)', icon: '🛵', tabTestId: TEST_LOCATORS.NAV.TAB_DELIVERY },
    { route: 'STORAGE', label: '10. Cloud Storage (User & Quota Admin)', icon: '☁️', tabTestId: TEST_LOCATORS.NAV.TAB_STORAGE },
    { route: 'MOBILITY', label: '11. Urban Mobility (Rider & Driver)', icon: '🚕', tabTestId: TEST_LOCATORS.NAV.TAB_MOBILITY },
    { route: 'REELS', label: '12. Video Reels (Viewer & Creator)', icon: '📱', tabTestId: TEST_LOCATORS.NAV.TAB_REELS },
    { route: 'RESONANCE_FEED', label: '13. Resonance Dating Feed', icon: '✨' },
    { route: 'ADMIN', label: '14. Super-Admin Support Console', icon: '🛡️', tabTestId: TEST_LOCATORS.NAV.TAB_ADMIN },
    { route: 'SETTINGS', label: 'Platform Settings & I18n', icon: '⚙️', tabTestId: TEST_LOCATORS.NAV.TAB_SETTINGS },
  ];

  const renderActiveScreen = () => {
    if (currentRoute === 'DYNAMIC_SDUI') {
      return (
        <View style={{ flex: 1, backgroundColor: '#020617' }}>
          <View style={styles.templateSwitcherBar}>
            <Text style={styles.templateSwitcherLabel}>SDUI TEMPLATE:</Text>
            <Pressable
              style={[styles.templateChip, selectedDynamicTemplate === 'ecommerce' && styles.templateChipActive]}
              onPress={() => setSelectedDynamicTemplate('ecommerce')}
            >
              <Text style={[styles.templateChipText, selectedDynamicTemplate === 'ecommerce' && styles.templateChipTextActive]}>
                🛍️ E-Commerce JSON
              </Text>
            </Pressable>
            <Pressable
              style={[styles.templateChip, selectedDynamicTemplate === 'medical' && styles.templateChipActive]}
              onPress={() => setSelectedDynamicTemplate('medical')}
            >
              <Text style={[styles.templateChipText, selectedDynamicTemplate === 'medical' && styles.templateChipTextActive]}>
                🏥 Medical JSON
              </Text>
            </Pressable>
          </View>
          <UniversalDynamicPage
            pageDefinition={selectedDynamicTemplate === 'ecommerce' ? DYNAMIC_ECOMMERCE_TEMPLATE : DYNAMIC_MEDICAL_TEMPLATE}
          />
        </View>
      );
    }

    // Universal Dynamic Domain Engine: renders any domain from @internal/contracts
    const dynamicDef = DYNAMIC_DOMAINS_REGISTRY[currentRoute];
    if (dynamicDef) {
      return <UniversalDynamicPage pageDefinition={dynamicDef} />;
    }

    switch (currentRoute) {
      case 'REELS':
        return <ReelsView />;
      case 'RESONANCE_FEED':
        return <ResonanceFeedScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      default:
        return <UniversalDynamicPage pageDefinition={DYNAMIC_ECOMMERCE_TEMPLATE} />;
    }
  };

  return (
    <View style={styles.root}>
      {/* Universal Top App Bar with Responsive Device & Orientation Telemetry */}
      <SafeAreaView style={styles.topBar} testID={TEST_LOCATORS.NAV.TOP_BAR}>
        <View style={styles.topBarContent}>
          <Pressable
            style={styles.hamburgerButton}
            onPress={() => setIsDrawerOpen(true)}
            testID={TEST_LOCATORS.NAV.HAMBURGER_BTN}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Open Navigation Drawer"
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </Pressable>

          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>Platform Hub</Text>
            <Text style={styles.routePill} testID={TEST_LOCATORS.NAV.ROUTE_PILL}>{currentRoute}</Text>
          </View>

          {/* Orientation & Aspect Ratio Telemetry Badge for Appium / BrowserStack */}
          <View style={styles.aspectBadge} testID={TEST_LOCATORS.NAV.ORIENTATION_BADGE}>
            <Text style={styles.aspectBadgeText}>
              {deviceType.toUpperCase()} • {orientation.toUpperCase()}
            </Text>
          </View>

          <Pressable
            style={styles.langToggle}
            onPress={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
            testID={TEST_LOCATORS.NAV.LANG_TOGGLE}
            accessible={true}
            accessibilityRole="button"
          >
            <Text style={styles.langToggleText}>
              {language === 'mr' ? 'मराठी' : 'EN'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Screen Body (Active Dynamic Feature) */}
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>

      {/* Primary Bottom Bar (Quick-Switch Horizontal Scroll on Small Phones, Fixed on Tablets) */}
      <SafeAreaView style={styles.bottomBar}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomBarContent}
        >
          <Pressable
            style={[styles.tabItem, currentRoute === 'MEDICAL' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('MEDICAL')}
            testID={TEST_LOCATORS.NAV.TAB_MEDICAL}
          >
            <Text style={styles.tabIcon}>🏥</Text>
            <Text style={[styles.tabLabel, currentRoute === 'MEDICAL' && styles.activeTabLabel]}>
              Medical
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'ECOMMERCE' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('ECOMMERCE')}
            testID={TEST_LOCATORS.NAV.TAB_ECOMMERCE}
          >
            <Text style={styles.tabIcon}>🛍️</Text>
            <Text style={[styles.tabLabel, currentRoute === 'ECOMMERCE' && styles.activeTabLabel]}>
              E-Com
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'PAYMENTS' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('PAYMENTS')}
            testID={TEST_LOCATORS.NAV.TAB_PAYMENTS}
          >
            <Text style={styles.tabIcon}>💳</Text>
            <Text style={[styles.tabLabel, currentRoute === 'PAYMENTS' && styles.activeTabLabel]}>
              UPI Pay
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'BANKING' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('BANKING')}
            testID={TEST_LOCATORS.NAV.TAB_BANKING}
          >
            <Text style={styles.tabIcon}>🏦</Text>
            <Text style={[styles.tabLabel, currentRoute === 'BANKING' && styles.activeTabLabel]}>
              Banking
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'DELIVERY' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('DELIVERY')}
            testID={TEST_LOCATORS.NAV.TAB_DELIVERY}
          >
            <Text style={styles.tabIcon}>🛵</Text>
            <Text style={[styles.tabLabel, currentRoute === 'DELIVERY' && styles.activeTabLabel]}>
              Delivery
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'REELS' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('REELS')}
            testID={TEST_LOCATORS.NAV.TAB_REELS}
          >
            <Text style={styles.tabIcon}>📱</Text>
            <Text style={[styles.tabLabel, currentRoute === 'REELS' && styles.activeTabLabel]}>
              Reels
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, currentRoute === 'ADMIN' && styles.activeTabItem]}
            onPress={() => setCurrentRoute('ADMIN')}
            testID={TEST_LOCATORS.NAV.TAB_ADMIN}
          >
            <Text style={styles.tabIcon}>🛡️</Text>
            <Text style={[styles.tabLabel, currentRoute === 'ADMIN' && styles.activeTabLabel]}>
              Admin
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      {/* Complete Hamburger Drawer Modal for All 15 Verticals */}
      <Modal
        visible={isDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDrawerOpen(false)}
        testID={TEST_LOCATORS.NAV.DRAWER_MODAL}
      >
        <View style={styles.drawerOverlay}>
          <View style={[styles.drawerSheet, isTablet && { width: '45%' }]}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Enterprise Directory</Text>
                <Text style={styles.drawerSub}>14 Cross-Industry Verticals</Text>
              </View>
              <Pressable
                onPress={() => setIsDrawerOpen(false)}
                testID={TEST_LOCATORS.NAV.DRAWER_CLOSE_BTN}
              >
                <Text style={styles.closeDrawerButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.drawerList}>
              {routesList.map((item) => (
                <Pressable
                  key={item.route}
                  style={[
                    styles.drawerItem,
                    currentRoute === item.route && styles.drawerItemActive,
                  ]}
                  onPress={() => {
                    setCurrentRoute(item.route);
                    setIsDrawerOpen(false);
                  }}
                  testID={item.tabTestId}
                >
                  <Text style={styles.drawerItemIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.drawerItemText,
                      currentRoute === item.route && styles.drawerItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hamburgerButton: {
    padding: 8,
  },
  hamburgerIcon: {
    fontSize: 22,
    color: '#F8FAFC',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  routePill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aspectBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  aspectBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  langToggle: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  langToggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomBar: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  bottomBarContent: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: '#1E293B',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
  },
  drawerSheet: {
    width: '85%',
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 14,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drawerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeDrawerButton: {
    fontSize: 22,
    color: '#94A3B8',
    padding: 6,
  },
  drawerList: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  drawerItemActive: {
    backgroundColor: '#1E293B',
  },
  drawerItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    flex: 1,
  },
  drawerItemTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  templateSwitcherBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  templateSwitcherLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  templateChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  templateChipActive: {
    backgroundColor: '#3B82F6',
  },
  templateChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  templateChipTextActive: {
    color: '#FFFFFF',
  },
});
