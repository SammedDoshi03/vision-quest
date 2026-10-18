import { z } from 'zod';

export const CheckInRequestSchema = z.object({
  sceneId: z.string(),
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  method: z.enum(['geofence', 'qr', 'nfc']).default('geofence'),
  passcode: z.string().optional(),
});
export type CheckInRequest = z.infer<typeof CheckInRequestSchema>;

export const CheckInResponseSchema = z.object({
  success: z.boolean(),
  sceneId: z.string(),
  verifiedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  activeCoPresentCount: z.number().int(),
});
export type CheckInResponse = z.infer<typeof CheckInResponseSchema>;

export const WavePayloadSchema = z.object({
  recipientUserId: z.string(),
  sceneId: z.string(),
  promptId: z.string(),
  replyText: z.string().min(1).max(280),
});
export type WavePayload = z.infer<typeof WavePayloadSchema>;
