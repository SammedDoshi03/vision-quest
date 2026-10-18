import { z } from 'zod';

export const PaymentTransactionSchema = z.object({
  transactionId: z.string(),
  idempotencyKey: z.string().uuid(),
  sourceVpa: z.string(),
  receiverVpa: z.string(),
  amountCents: z.number().int().positive(),
  currency: z.string().default('INR'),
  status: z.enum(['INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED']),
  rrn: z.string().optional(),
  soundboxBroadcastStatus: z.enum(['SENT', 'QUEUED', 'NOT_APPLICABLE']).default('NOT_APPLICABLE'),
  createdAtUtc: z.string(),
});
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
