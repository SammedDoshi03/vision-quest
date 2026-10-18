import { z } from 'zod';

export const RequestOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'E.164 phone number required'),
});
export type RequestOtpDto = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/),
  code: z.string().length(6),
  deviceFingerprint: z.string().optional(),
});
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;

export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresInSeconds: z.number().int(),
});
export type TokenPair = z.infer<typeof TokenPairSchema>;

export const SessionUserSchema = z.object({
  userId: z.string(),
  phoneNumber: z.string(),
  status: z.enum(['onboarding', 'active', 'suspended']),
  displayName: z.string().optional(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const AuthResponseSchema = z.object({
  tokens: TokenPairSchema,
  user: SessionUserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
