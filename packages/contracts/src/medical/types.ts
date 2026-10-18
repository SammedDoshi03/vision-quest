import { z } from 'zod';

export const ReminderStatusSchema = z.enum(['DUE_NOW', 'TAKEN', 'MISSED', 'UPCOMING']);
export type ReminderStatus = z.infer<typeof ReminderStatusSchema>;

export const MedicationScheduleSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  medicineName: z.string().min(1),
  medicineNameMr: z.string().optional(),
  dosage: z.string().min(1),
  dosageMr: z.string().optional(),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
  frequency: z.enum(['DAILY', 'TWICE_DAILY', 'WEEKLY', 'AS_NEEDED']).default('DAILY'),
  status: ReminderStatusSchema.default('UPCOMING'),
  pillColorHex: z.string().optional(),
  instructions: z.string().optional(),
  instructionsMr: z.string().optional(),
  active: z.boolean().default(true),
});
export type MedicationSchedule = z.infer<typeof MedicationScheduleSchema>;

export const AdherenceLogSchema = z.object({
  logId: z.string(),
  patientId: z.string(),
  reminderId: z.string(),
  scheduledDate: z.string(), // YYYY-MM-DD
  status: z.enum(['TAKEN', 'MISSED', 'SNOOZED', 'SKIPPED']),
  takenAtUtc: z.number().optional(), // epoch ms
  source: z.enum(['PATIENT_ACTION', 'CAREGIVER_OVERRIDE', 'NOTIFICATION_ACTION']).default('PATIENT_ACTION'),
});
export type AdherenceLog = z.infer<typeof AdherenceLogSchema>;

export const PatientProfileSchema = z.object({
  patientUid: z.string(),
  name: z.string().min(1),
  nameMr: z.string().optional(),
  preferredLanguage: z.enum(['en', 'mr']).default('mr'),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relation: z.string().default('Family'),
  }),
  settings: z.object({
    textScale: z.number().min(1.0).max(2.0).default(1.25),
    highContrast: z.boolean().default(true),
    alarmVolume: z.number().min(0.0).max(1.0).default(1.0),
    soundFile: z.string().default('medication_chime.wav'),
  }),
});
export type PatientProfile = z.infer<typeof PatientProfileSchema>;

export const CaregiverProfileSchema = z.object({
  caregiverUid: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  tier: z.enum(['standard', 'family_premium']).default('family_premium'),
  monitoredPatients: z.array(z.string()).default([]),
});
export type CaregiverProfile = z.infer<typeof CaregiverProfileSchema>;

export const CaregiverAlertSchema = z.object({
  alertId: z.string(),
  caregiverUid: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  type: z.enum(['MISSED_DOSE', 'SOS_PANIC', 'DEVICE_OFFLINE', 'SCHEDULE_CHANGED']),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  message: z.string(),
  messageMr: z.string().optional(),
  timestamp: z.number(), // epoch ms
  acknowledged: z.boolean().default(false),
});
export type CaregiverAlert = z.infer<typeof CaregiverAlertSchema>;

export const PatientPairingRequestSchema = z.object({
  patientLoginId: z.string().min(4),
  pin: z.string().length(4), // 4-digit PIN
  caregiverUid: z.string(),
});
export type PatientPairingRequest = z.infer<typeof PatientPairingRequestSchema>;

// BFF Client-facing request DTOs
export const MarkReminderTakenDtoSchema = z.object({
  patientId: z.string(),
  reminderId: z.string(),
  timestamp: z.number().optional(),
  clientOfflineNonce: z.string().optional(),
});
export type MarkReminderTakenDto = z.infer<typeof MarkReminderTakenDtoSchema>;

export const CreateMedicationScheduleDtoSchema = MedicationScheduleSchema.omit({
  id: true,
  status: true,
});
export type CreateMedicationScheduleDto = z.infer<typeof CreateMedicationScheduleDtoSchema>;
