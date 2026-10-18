# Project 01: Dual-Interface Healthcare & Medication Adherence Platform

> Derived from: `newProjectIdea.txt`  
> Focus: Elderly Patient Mode (AAA Accessibility, 64dp Touch Targets, 1-Tap "I Took It") vs. Caregiver Mode ("Clinical Calm", Adherence Tickers, Urgent Missed-Dose Alerts, Prescription CRUD).

---

## 1. Domain Overview & High-Level Concept

The platform bridges the critical care gap between elderly patients (who struggle with tiny fonts, complex navigation, and remembering complex schedules) and adult children/caregivers (who need real-time peace of mind without hovering or constantly calling).

```
                      ┌────────────────────────────────────────────────────────┐
                      │                 Dual Mobile Interfaces                 │
                      │   Patient Flow (Elderly)  │  Caregiver Flow (Clinical) │
                      └───────────┬───────────────┴────────────┬───────────────┘
                                  │                            │
                                  ▼                            ▼
                      ┌───────────────────────┐    ┌───────────────────────────┐
                      │ Local Offline Engine  │    │  Caregiver Dashboard BFF  │
                      │ - Exact Alarms        │    │  - Monitored Patients     │
                      │ - 64dp Tap "I Took It"│    │  - Adherence Telemetry    │
                      │ - SQLite Sync Outbox  │    │  - Prescription CRUD      │
                      └───────────┬───────────┘    └───────────┬───────────────┘
                                  │                            │
                                  └─────────────┬──────────────┘
                                                ▼
                                    BFF Abstraction Layer
                                    (IReminderService, etc.)
                                                ▼
                                   Backend (NestJS / Firebase)
```

---

## 2. Key Modules & Functional Scope

### A. Patient Mode
1. **Simplified Authentication:** 4-digit numeric PIN entry + Patient Login ID. Zero social auth or passwords to remember.
2. **"Today's Schedule" Feed:** High-contrast, card-based daily view sorted chronologically. Statuses: `DUE_NOW`, `TAKEN`, `UPCOMING`, `MISSED`.
3. **1-Tap Dose Confirmation:** Huge unmissable action button ("मी औषध घेतले" / "I Took It") with auditory chime and haptic feedback.
4. **Offline Exact Alarms:** Alarms ring on the dot via `SCHEDULE_EXACT_ALARM`, bypassing Android Doze Mode.
5. **Emergency 1-Tap SOS:** Massive call button connecting directly to designated emergency contact via `Linking.openURL('tel:...')`.
6. **Bilingual Toggle:** Dynamic instant switch between English (`en`) and Marathi (`mr`).

### B. Caregiver Mode ("Clinical Calm")
1. **Adherence Dashboard:** At-a-glance status of monitored parents (e.g. "Mom took 2 of 3 doses today").
2. **Prescription & Medication CRUD:** Add/edit medicine name, dosage, schedule time, pill visual cues (color/shape), and food relationship ("After food").
3. **Critical Missed-Dose Alerts:** Instant push notification if dose is missed by >30 minutes, with 1-tap "Call Mom" escalation.
4. **Patient Pairing Portal:** Generate unique pairing codes and 4-digit PIN hashes for linking.

---

## 3. Data Schema & DTO Definitions

```typescript
// Shared Types & DTOs
export type ReminderStatus = 'DUE_NOW' | 'TAKEN' | 'MISSED' | 'UPCOMING';
export type DoseFrequency = 'DAILY' | 'TWICE_DAILY' | 'WEEKLY' | 'CUSTOM';
export type FoodRelation = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'NO_RESTRICTION';

export interface MedicationScheduleDTO {
  id: string;
  patientId: string;
  medicineName: string;
  medicineNameMr: string;
  dosage: string;
  dosageMr: string;
  scheduledTime: string; // "HH:mm" (24h format)
  frequency: DoseFrequency;
  foodRelation: FoodRelation;
  pillColorHex: string;
  pillShape: 'round' | 'capsule' | 'oval';
  active: boolean;
  createdAt: string;
}

export interface DoseLogDTO {
  id: string;
  patientId: string;
  reminderId: string;
  scheduledDate: string; // "YYYY-MM-DD"
  status: ReminderStatus;
  takenAt?: string;
  source: 'PATIENT_1TAP' | 'CAREGIVER_OVERRIDE' | 'NOTIFICATION_ACTION';
}

export interface CaregiverAlertDTO {
  id: string;
  caregiverId: string;
  patientId: string;
  patientName: string;
  type: 'MISSED_DOSE' | 'LOW_ADHERENCE' | 'SOS_TRIGGERED';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  messageMr: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface PatientProfileDTO {
  id: string;
  name: string;
  age: number;
  preferredLanguage: 'en' | 'mr';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  accessibilitySettings: {
    fontScale: number; // 1.0 to 1.5
    highContrast: boolean;
    alarmVolume: number;
    hapticStrength: 'light' | 'heavy';
  };
  caregiverIds: string[];
}
```

---

## 4. UI Kit Components Required

| Component | Target Audience | Accessibility & Styling Specs |
|---|---|---|
| `PatientActionCard` | Patient | Min height 140dp, 16dp padding, border 2px solid, high-contrast text. |
| `BigActionButton` | Patient | **Min height 64×64dp**, large bold typography (22px), high-contrast Green (`#15803D`) or Red (`#DC2626`). |
| `SosEmergencyButton` | Patient | Deep crimson (`#B91C1C`), min 64dp, telephone icon, instant dialer trigger. |
| `ClinicalMetricCard` | Caregiver | Medical Teal (`#0F766E`), adherence progress circle, 44dp touch target. |
| `AlertTicker` | Caregiver | Amber/Red pill chip with pulse indicator for unread missed doses. |
| `PrescriptionForm` | Caregiver | Time picker, color selector, bilingual medicine translation input. |

---

## 5. Offline Alarms & Service Contracts

```typescript
export interface IReminderService {
  getTodaySchedules(patientId: string): Promise<MedicationScheduleDTO[]>;
  markAsTaken(patientId: string, reminderId: string, source: string): Promise<void>;
  createReminder(patientId: string, dto: Omit<MedicationScheduleDTO, 'id' | 'createdAt'>): Promise<string>;
  updateReminder(patientId: string, dto: MedicationScheduleDTO): Promise<void>;
  deleteReminder(patientId: string, reminderId: string): Promise<void>;
}

export interface IAlertService {
  getCaregiverAlerts(caregiverId: string): Promise<CaregiverAlertDTO[]>;
  acknowledgeAlert(alertId: string): Promise<void>;
}
```

- **Exact Alarm Strategy:** 
  - Android: `SCHEDULE_EXACT_ALARM`, notification category `MEDICATION_REMINDER` with quick actions `[ "I Took It", "Snooze 10m" ]`.
  - Re-registration: Background receiver binds to `android.intent.action.BOOT_COMPLETED` and schedules the next 7 days in SQLite.
