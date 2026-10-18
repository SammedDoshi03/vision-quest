import { z } from 'zod';

export const StorageAccountQuotaSchema = z.object({
  accountId: z.string(),
  userId: z.string(),
  totalQuotaBytes: z.number().int().positive(),
  usedBytes: z.number().int().nonnegative(),
  tier: z.enum(['FREE_15GB', 'BASIC_100GB', 'STANDARD_200GB', 'PREMIUM_2TB']),
  isGracePeriod: z.boolean().default(false),
});
export type StorageAccountQuota = z.infer<typeof StorageAccountQuotaSchema>;
