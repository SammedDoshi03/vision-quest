import { z } from 'zod';

export const QuickCommerceOrderSchema = z.object({
  orderId: z.string(),
  darkStoreId: z.string(),
  customerId: z.string(),
  status: z.enum(['ORDER_CONFIRMED', 'PACKING', 'RIDER_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED']),
  items: z.array(z.object({ skuId: z.string(), quantity: z.number() })),
  otpCode: z.string().length(4),
  estimatedDeliveryMinutes: z.number(),
  createdAtUtc: z.string(),
});
export type QuickCommerceOrder = z.infer<typeof QuickCommerceOrderSchema>;
