import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface RadioOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string | number = string> {
  options: RadioOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  orientation?: 'vertical' | 'horizontal';
  label?: string;
  disabled?: boolean;
  testID?: string;
}

export function RadioGroup<T extends string | number = string>({
  options,
  value,
  onValueChange,
  orientation = 'vertical',
  label,
  disabled = false,
  testID = 'radio-group',
}: RadioGroupProps<T>) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="radiogroup"
      accessibilityLabel={label || 'Radio Group'}
      testID={testID}
    >
      {label && <Text style={styles.groupLabel}>{label}</Text>}

      <View style={orientation === 'horizontal' ? styles.rowLayout : styles.colLayout}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          const isDisabled = disabled || opt.disabled;

          return (
            <Pressable
              key={String(opt.value)}
              style={[styles.radioItem, isDisabled && styles.radioItemDisabled]}
              onPress={() => !isDisabled && onValueChange(opt.value)}
              disabled={isDisabled}
              accessible={true}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              accessibilityLabel={opt.label}
              testID={`${testID}-opt-${String(opt.value)}`}
            >
              <View
                style={[
                  styles.circleOuter,
                  isSelected && styles.circleOuterSelected,
                  isDisabled && styles.circleOuterDisabled,
                ]}
              >
                {isSelected && <View style={styles.circleInner} />}
              </View>

              <View style={styles.textCol}>
                <Text style={[styles.optionLabel, isDisabled && styles.textDisabled]}>
                  {opt.label}
                </Text>
                {opt.description && (
                  <Text style={[styles.optionDesc, isDisabled && styles.textDisabled]}>
                    {opt.description}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  colLayout: {
    flexDirection: 'column',
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 6,
  },
  radioItemDisabled: {
    opacity: 0.5,
  },
  circleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#64748B',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleOuterSelected: {
    borderColor: '#38BDF8',
  },
  circleOuterDisabled: {
    borderColor: '#475569',
  },
  circleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
  },
  textCol: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  optionDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  textDisabled: {
    color: '#64748B',
  },
});
