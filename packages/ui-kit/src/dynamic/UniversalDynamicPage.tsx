import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { DynamicPageDefinition, DynamicAction, TEST_LOCATORS } from '@internal/contracts';
import { DynamicComponentRegistry } from './DynamicComponentRegistry';
import { ResponsiveContainer } from '../responsive';
import { useHardwareBackHandler } from '../components/useHardwareBackHandler';

export interface UniversalDynamicPageProps {
  pageDefinition: DynamicPageDefinition;
  onCustomAction?: (action: DynamicAction) => void;
  onBack?: () => void;
  testID?: string;
}

export function UniversalDynamicPage({
  pageDefinition,
  onCustomAction,
  onBack,
  testID = 'universal-dynamic-page',
}: UniversalDynamicPageProps) {
  const [activeRole, setActiveRole] = useState<'primary' | 'secondary'>(
    pageDefinition.initialRole || 'primary'
  );
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  // Android hardware back handler: if on secondary persona, back switches to primary persona first!
  useHardwareBackHandler(() => {
    if (activeRole === 'secondary') {
      setActiveRole('primary');
      return true; // handled
    }
    if (onBack) {
      onBack();
      return true;
    }
    return false; // let system default exit
  });

  const handleToggleChange = (id: string, value: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: value }));
  };

  const handleDispatchAction = (action: DynamicAction) => {
    switch (action.type) {
      case 'SHOW_TOAST':
        Alert.alert(
          'Notification',
          (action as any).message || action.payload?.message || 'Action executed successfully'
        );
        break;
      case 'CHANGE_ROLE':
        setActiveRole((action as any).role || action.payload?.role || 'primary');
        break;
      case 'API_MUTATION':
      case 'DISPATCH_API':
        Alert.alert(
          'API Mutation',
          `${(action as any).method || 'POST'} ${(action as any).endpoint || action.actionId || ''}`
        );
        onCustomAction?.(action);
        break;
      case 'NAVIGATE':
        Alert.alert('Navigation', `Target Route: ${(action as any).targetRoute}`);
        onCustomAction?.(action);
        break;
      case 'NATIVE_BRIDGE':
        Alert.alert('Hardware Capability', `Invoking: ${(action as any).capability}`);
        onCustomAction?.(action);
        break;
      default:
        onCustomAction?.(action);
        break;
    }
  };

  const renderSectionComponents = (role: 'primary' | 'secondary') => {
    return (
      <View style={styles.sectionsContainer}>
        {pageDefinition.sections.map((section) => {
          if (
            section.roleVisibility &&
            section.roleVisibility.length > 0 &&
            !section.roleVisibility.includes(role)
          ) {
            return null;
          }

          return (
            <View key={section.id} style={styles.sectionBlock}>
              {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
              {section.subtitle && <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>}

              <View
                style={
                  section.layout === 'grid'
                    ? styles.gridLayout
                    : styles.stackLayout
                }
              >
                {section.components.map((comp) => (
                  <DynamicComponentRegistry
                    key={comp.id}
                    definition={comp}
                    activeRole={role}
                    toggleStates={toggleStates}
                    onToggleChange={handleToggleChange}
                    onDispatchAction={handleDispatchAction}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const role1 = pageDefinition.roles[0];
  const role2 = pageDefinition.roles[1];

  return (
    <View style={styles.root} testID={testID}>
      {/* Dynamic Header & Persona Switcher */}
      <View style={styles.headerBar}>
        <View style={styles.headerInfo}>
          <Text style={styles.pageTitle}>{pageDefinition.title}</Text>
          {pageDefinition.subtitle && (
            <Text style={styles.pageSubtitle}>{pageDefinition.subtitle}</Text>
          )}
        </View>

        <View style={styles.rolePickerRow} testID={TEST_LOCATORS.ROLES.SWITCHER_CONTAINER}>
          <Pressable
            style={[styles.roleBtn, activeRole === 'primary' && styles.roleBtnActive]}
            onPress={() => setActiveRole('primary')}
            testID={TEST_LOCATORS.ROLES.ROLE_PRIMARY_BTN}
          >
            <Text style={styles.roleIcon}>{role1.icon}</Text>
            <Text style={[styles.roleLabel, activeRole === 'primary' && styles.roleLabelActive]}>
              {role1.label}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.roleBtn, activeRole === 'secondary' && styles.roleBtnActive]}
            onPress={() => setActiveRole('secondary')}
            testID={TEST_LOCATORS.ROLES.ROLE_SECONDARY_BTN}
          >
            <Text style={styles.roleIcon}>{role2.icon}</Text>
            <Text style={[styles.roleLabel, activeRole === 'secondary' && styles.roleLabelActive]}>
              {role2.label}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Responsive Master-Detail Split on Tablets/Landscape or Dynamic Stack on Phones */}
      <ResponsiveContainer
        scrollable={true}
        leftPane={renderSectionComponents('primary')}
        rightPane={renderSectionComponents('secondary')}
      >
        {renderSectionComponents(activeRole)}
      </ResponsiveContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  headerBar: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerInfo: {
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  rolePickerRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  roleBtnActive: {
    backgroundColor: '#3B82F6',
  },
  roleIcon: {
    fontSize: 14,
  },
  roleLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  roleLabelActive: {
    color: '#FFFFFF',
  },
  sectionsContainer: {
    padding: 16,
    width: '100%',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  stackLayout: {
    gap: 8,
  },
  gridLayout: {
    gap: 8,
  },
});
