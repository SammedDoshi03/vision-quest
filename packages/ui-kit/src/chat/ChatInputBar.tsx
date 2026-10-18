import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { nativeBridge } from '@internal/contracts';

export interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onAttach,
  placeholder = 'Type an encrypted message...',
  disabled = false,
  testID = 'chat-input-bar',
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (canSend) {
      try {
        nativeBridge.impact('light');
      } catch {
        // Fallback
      }
      onSend(value.trim());
      onChangeText('');
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      {onAttach && (
        <Pressable
          style={styles.attachBtn}
          onPress={onAttach}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Attach media or document"
        >
          <Text style={styles.attachIcon}>📎</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        multiline
        maxLength={4000}
        editable={!disabled}
        accessibilityLabel="Chat Message Input"
      />

      <Pressable
        style={[styles.sendBtn, canSend && styles.sendBtnActive]}
        onPress={handleSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        testID="chat-send-btn"
      >
        <Text style={[styles.sendIcon, canSend && styles.sendIconActive]}>➤</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  attachBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F8FAFC',
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#334155',
    marginHorizontal: 8,
  },
  sendBtn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#38BDF8',
  },
  sendIcon: {
    fontSize: 16,
    color: '#64748B',
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  sendIconActive: {
    color: '#0F172A',
  },
});
