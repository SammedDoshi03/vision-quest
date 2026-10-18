import React, { ReactNode } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface KeyboardDismissContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
}

export function KeyboardDismissContainer({
  children,
  style,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0,
}: KeyboardDismissContainerProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
