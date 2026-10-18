import { z } from 'zod';

export const EnergyWorkOrderSchema = z.object({
  orderId: z.string(),
  assetId: z.string(),
  technicianId: z.string(),
  severity: z.enum(['ROUTINE', 'ELEVATED', 'CRITICAL_OUTAGE']),
  status: z.enum(['ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  lotoChecklistCompleted: z.boolean().default(false),
  photoEvidenceUrls: z.array(z.string().url()).default([]),
  slaDeadlineUtc: z.string(),
});
export type EnergyWorkOrder = z.infer<typeof EnergyWorkOrderSchema>;
