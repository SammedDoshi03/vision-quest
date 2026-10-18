import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TEST_LOCATORS } from '@internal/contracts';

export interface RoleSelectorProps {
  primaryRoleLabel: string;
  secondaryRoleLabel: string;
  primaryIcon?: string;
  secondaryIcon?: string;
  activeRole: 'primary' | 'secondary';
  onRoleChange: (role: 'primary' | 'secondary') => void;
  testIDPrefix?: string;
}

export function RoleSelector({
  primaryRoleLabel,
  secondaryRoleLabel,
  primaryIcon = '👤',
  secondaryIcon = '🛡️',
  activeRole,
  onRoleChange,
  testIDPrefix = 'role',
}: RoleSelectorProps) {
  return (
    <View style={styles.container} testID={TEST_LOCATORS.ROLES.SWITCHER_CONTAINER}>
      <Pressable
        style={[styles.pill, activeRole === 'primary' && styles.pillActive]}
        onPress={() => onRoleChange('primary')}
        testID={TEST_LOCATORS.ROLES.ROLE_PRIMARY_BTN}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeRole === 'primary' }}
        accessibilityLabel={primaryRoleLabel}
      >
        <Text style={[styles.pillText, activeRole === 'primary' && styles.pillTextActive]}>
          {primaryIcon} {primaryRoleLabel}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.pill, activeRole === 'secondary' && styles.pillActive]}
        onPress={() => onRoleChange('secondary')}
        testID={TEST_LOCATORS.ROLES.ROLE_SECONDARY_BTN}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeRole === 'secondary' }}
        accessibilityLabel={secondaryRoleLabel}
      >
        <Text style={[styles.pillText, activeRole === 'secondary' && styles.pillTextActive]}>
          {secondaryIcon} {secondaryRoleLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 13,
  },
  pillTextActive: {
    color: '#0F172A',
  },
});
