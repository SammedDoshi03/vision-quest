import { z } from 'zod';

export const GrievanceTicketSchema = z.object({
  ticketId: z.string(),
  citizenId: z.string(),
  category: z.enum(['ROADS', 'SANITATION', 'WATER_SUPPLY', 'ELECTRICAL', 'PUBLIC_HEALTH']),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED']),
  slaDeadlineUtc: z.string(),
  beforePhotoUrls: z.array(z.string().url()).default([]),
  afterPhotoUrls: z.array(z.string().url()).default([]),
});
export type GrievanceTicket = z.infer<typeof GrievanceTicketSchema>;
