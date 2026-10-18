import { z } from 'zod';

export const ProductSkuSchema = z.object({
  skuId: z.string(),
  title: z.string(),
  brand: z.string(),
  category: z.string(),
  priceCents: z.number().int().positive(),
  currency: z.string().default('USD'),
  availableSizes: z.array(z.string()),
  colorSwatches: z.array(z.string()),
  imageUrl: z.string().url(),
  inventoryCount: z.number().int().nonnegative(),
});
export type ProductSku = z.infer<typeof ProductSkuSchema>;

export const CartReservationSchema = z.object({
  reservationId: z.string(),
  cartId: z.string(),
  items: z.array(z.object({ skuId: z.string(), quantity: z.number() })),
  expiresAtUtc: z.string(),
});
export type CartReservation = z.infer<typeof CartReservationSchema>;
