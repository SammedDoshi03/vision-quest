import { z } from 'zod';

export const MobilityTripSchema = z.object({
  tripId: z.string(),
  riderId: z.string(),
  driverId: z.string().optional(),
  tier: z.enum(['MOTO', 'AUTO', 'SEDAN_ECONOMY', 'PREMIUM_XL']),
  status: z.enum(['REQUESTED', 'MATCHED', 'DRIVER_ARRIVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']),
  pickupCoords: z.object({ lat: z.number(), lng: z.number(), address: z.string() }),
  dropoffCoords: z.object({ lat: z.number(), lng: z.number(), address: z.string() }),
  startOtpPin: z.string().length(4),
  fareAmountCents: z.number().int().positive(),
  surgeMultiplier: z.number().default(1.0),
});
export type MobilityTrip = z.infer<typeof MobilityTripSchema>;
