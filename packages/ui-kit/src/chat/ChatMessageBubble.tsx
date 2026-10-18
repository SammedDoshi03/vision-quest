import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type MessageDeliveryStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface ChatMessageBubbleProps {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  senderName?: string;
  status?: MessageDeliveryStatus;
  replyTo?: {
    senderName: string;
    text: string;
  };
  encrypted?: boolean;
  onLongPress?: () => void;
  testID?: string;
}

export function ChatMessageBubble({
  id,
  text,
  timestamp,
  isOutgoing,
  senderName,
  status = 'DELIVERED',
  replyTo,
  encrypted = true,
  onLongPress,
  testID = 'chat-message-bubble',
}: ChatMessageBubbleProps) {
  const renderStatus = () => {
    if (!isOutgoing) return null;
    if (status === 'SENDING') return <Text style={styles.statusText}>🕒</Text>;
    if (status === 'SENT') return <Text style={styles.statusText}>✓</Text>;
    if (status === 'DELIVERED') return <Text style={styles.statusText}>✓✓</Text>;
    if (status === 'READ') return <Text style={[styles.statusText, styles.statusRead]}>✓✓</Text>;
    if (status === 'FAILED') return <Text style={[styles.statusText, styles.statusFailed]}>⚠️</Text>;
    return null;
  };

  return (
    <Pressable
      style={[styles.rowContainer, isOutgoing ? styles.rowOutgoing : styles.rowIncoming]}
      onLongPress={onLongPress}
      testID={`${testID}-${id}`}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${isOutgoing ? 'You' : senderName || 'User'}: ${text}. ${timestamp}`}
    >
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
        ]}
      >
        {/* Sender name for group chats */}
        {!isOutgoing && senderName && (
          <Text style={styles.senderNameText}>{senderName}</Text>
        )}

        {/* Quoted Reply Preview */}
        {replyTo && (
          <View style={styles.replyQuoteBox}>
            <Text style={styles.replySender}>{replyTo.senderName}</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyTo.text}
            </Text>
          </View>
        )}

        {/* Message Content */}
        <Text style={[styles.messageText, isOutgoing && styles.messageTextOutgoing]}>
          {text}
        </Text>

        {/* Timestamp, Status & Encryption Meta */}
        <View style={styles.metaRow}>
          {encrypted && <Text style={styles.lockIcon}>🔒</Text>}
          <Text style={[styles.timeText, isOutgoing && styles.timeTextOutgoing]}>
            {timestamp}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowOutgoing: {
    justifyContent: 'flex-end',
  },
  rowIncoming: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleOutgoing: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: 4,
  },
  bubbleIncoming: {
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  senderNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 4,
  },
  replyQuoteBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  replySender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  replyText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  messageText: {
    fontSize: 14,
    color: '#F8FAFC',
    lineHeight: 20,
  },
  messageTextOutgoing: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  lockIcon: {
    fontSize: 10,
    opacity: 0.7,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  timeTextOutgoing: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusRead: {
    color: '#7DD3FC',
  },
  statusFailed: {
    color: '#FCA5A5',
  },
});
