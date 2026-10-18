import { z } from 'zod';

export const ChatMessageSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  kind: z.enum(['TEXT', 'VOICE_NOTE', 'IMAGE', 'VIDEO', 'DOCUMENT']),
  cipherPayload: z.string(),
  deliveryStatus: z.enum(['OUTBOX', 'SENT_SERVER', 'DELIVERED_DEVICE', 'READ_BY_USER']),
  sentAtUtc: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
