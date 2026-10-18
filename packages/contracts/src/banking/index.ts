import { z } from 'zod';

export const BankAccountSchema = z.object({
  accountId: z.string(),
  accountNumberMasked: z.string(),
  currency: z.string().default('USD'),
  availableBalanceCents: z.number().int(),
  isFrozen: z.boolean().default(false),
  dailyAtmLimitCents: z.number().int().default(50000),
  contactlessEnabled: z.boolean().default(true),
});
export type BankAccount = z.infer<typeof BankAccountSchema>;
