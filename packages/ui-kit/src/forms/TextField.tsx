import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';

export type TextFieldType = 'text' | 'email' | 'password' | 'number' | 'phone' | 'search' | 'multiline';

export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  type?: TextFieldType;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefixText?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  testID?: string;
}

export function TextField({
  value,
  onChangeText,
  type = 'text',
  label,
  placeholder,
  helperText,
  errorText,
  disabled = false,
  readOnly = false,
  prefixText,
  prefixIcon,
  suffixIcon,
  maxLength,
  showCharacterCount = false,
  multiline = false,
  numberOfLines = 3,
  autoCapitalize,
  autoCorrect = false,
  returnKeyType,
  onSubmitEditing,
  testID = 'text-field',
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const isSearch = type === 'search';
  const isMultiline = type === 'multiline' || multiline;

  let keyboardType: KeyboardTypeOptions = 'default';
  if (type === 'email') keyboardType = 'email-address';
  else if (type === 'number') keyboardType = 'numeric';
  else if (type === 'phone') keyboardType = 'phone-pad';

  let resolvedAutoCapitalize = autoCapitalize;
  if (!resolvedAutoCapitalize) {
    if (type === 'email' || type === 'password') resolvedAutoCapitalize = 'none';
    else resolvedAutoCapitalize = 'sentences';
  }

  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      {/* Label & Character Count Row */}
      {(label || (showCharacterCount && maxLength)) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.labelText}>{label}</Text>}
          {showCharacterCount && maxLength && (
            <Text style={styles.charCountText}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}

      {/* Input Box Shell */}
      <View
        style={[
          styles.inputContainer,
          isMultiline && styles.inputMultilineContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {/* Prefix Text or Icon */}
        {prefixIcon && <Text style={styles.prefixIcon}>{prefixIcon}</Text>}
        {prefixText && <Text style={styles.prefixText}>{prefixText}</Text>}

        {/* Core TextInput */}
        <TextInput
          style={[styles.input, isMultiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          editable={!disabled && !readOnly}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={resolvedAutoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          multiline={isMultiline}
          numberOfLines={isMultiline ? numberOfLines : 1}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          accessible={true}
          accessibilityLabel={label || placeholder || 'Text Input'}
        />

        {/* Clear Button for Search Input */}
        {isSearch && value.length > 0 && (
          <Pressable
            style={styles.clearBtn}
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Clear input"
          >
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}

        {/* Password Visibility Eye Toggle */}
        {isPassword && (
          <Pressable
            style={styles.eyeBtn}
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🔒'}</Text>
          </Pressable>
        )}

        {/* Custom Suffix Icon */}
        {!isPassword && !isSearch && suffixIcon && (
          <Text style={styles.suffixIcon}>{suffixIcon}</Text>
        )}
      </View>

      {/* Helper or Error Message */}
      {hasError ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          ⚠️ {errorText}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  charCountText: {
    fontSize: 11,
    color: '#64748B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputMultilineContainer: {
    minHeight: 90,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputContainerFocused: {
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputContainerDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#F8FAFC',
    paddingVertical: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  prefixIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginRight: 8,
  },
  suffixIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  eyeBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  eyeIcon: {
    fontSize: 16,
  },
  clearBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  clearIcon: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 2,
  },
});
