import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  testID?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  testID = 'checkbox',
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <Pressable
      style={[styles.container, disabled && styles.containerDisabled]}
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      accessibilityLabel={label || 'Checkbox'}
      testID={testID}
    >
      <View
        style={[
          styles.box,
          (checked || indeterminate) && styles.boxChecked,
          disabled && styles.boxDisabled,
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
        {!checked && indeterminate && <Text style={styles.indeterminateDash}>−</Text>}
      </View>

      {(label || description) && (
        <View style={styles.labelCol}>
          {label && <Text style={[styles.labelText, disabled && styles.textDisabled]}>{label}</Text>}
          {description && (
            <Text style={[styles.descText, disabled && styles.textDisabled]}>{description}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 6,
    marginVertical: 4,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boxChecked: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  boxDisabled: {
    borderColor: '#475569',
    backgroundColor: '#1E293B',
  },
  checkmark: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
  },
  indeterminateDash: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 16,
  },
  labelCol: {
    flex: 1,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  descText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  textDisabled: {
    color: '#64748B',
  },
});
