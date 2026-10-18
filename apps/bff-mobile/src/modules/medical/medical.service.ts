import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  type MedicationSchedule,
  type PatientProfile,
  type CaregiverProfile,
  type CaregiverAlert,
  type CreateMedicationScheduleDto,
  createId,
} from '@internal/contracts';

export interface IReminderService {
  getTodaySchedules(patientId: string): Promise<MedicationSchedule[]>;
  markAsTaken(patientId: string, reminderId: string): Promise<void>;
  createReminder(patientId: string, reminder: CreateMedicationScheduleDto): Promise<string>;
  deleteReminder(patientId: string, reminderId: string): Promise<void>;
}

export interface IPatientService {
  getPatientProfile(patientId: string): Promise<PatientProfile>;
  updatePatientSettings(patientId: string, settings: Partial<PatientProfile['settings']>): Promise<void>;
}

export interface IAlertService {
  getCaregiverAlerts(caregiverUid: string): Promise<CaregiverAlert[]>;
  acknowledgeAlert(alertId: string): Promise<void>;
}

export interface IPairingService {
  pairPatientWithCaregiver(patientLoginId: string, pin: string, caregiverUid: string): Promise<{ success: boolean; patientId: string }>;
}

@Injectable()
export class MedicalService implements IReminderService, IPatientService, IAlertService, IPairingService {
  // Pre-seeded database matching the clinical mockup in newProjectIdea.txt
  private patients: Map<string, PatientProfile> = new Map([
    [
      'pt_101',
      {
        patientUid: 'pt_101',
        name: 'Aaji (Mom)',
        nameMr: 'आजी (आई)',
        preferredLanguage: 'mr',
        emergencyContact: {
          name: 'Rahul (Son)',
          phone: '+919876543210',
          relation: 'Son',
        },
        settings: {
          textScale: 1.25,
          highContrast: true,
          alarmVolume: 1.0,
          soundFile: 'medication_chime.wav',
        },
      },
    ],
  ]);

  private caregivers: Map<string, CaregiverProfile> = new Map([
    [
      'cg_202',
      {
        caregiverUid: 'cg_202',
        name: 'Rahul',
        email: 'caregiver@example.com',
        phone: '+919876543210',
        tier: 'family_premium',
        monitoredPatients: ['pt_101'],
      },
    ],
  ]);

  private pairings: Map<string, { patientUid: string; pinHash: string; caregiverUid: string }> = new Map([
    [
      'AAJI101',
      {
        patientUid: 'pt_101',
        pinHash: '1234', // In production, bcrypt hash
        caregiverUid: 'cg_202',
      },
    ],
  ]);

  private schedules: Map<string, MedicationSchedule> = new Map([
    [
      'rem_001',
      {
        id: 'rem_001',
        patientId: 'pt_101',
        medicineName: 'Metformin 500mg',
        medicineNameMr: 'मेटफॉर्मिन ५०० मि.ग्रॅ.',
        dosage: '1 Tablet after morning food',
        dosageMr: 'सकाळच्या जेवणानंतर १ गोळी',
        scheduledTime: '09:00',
        frequency: 'DAILY',
        status: 'DUE_NOW',
        pillColorHex: '#3B82F6',
        active: true,
      },
    ],
    [
      'rem_002',
      {
        id: 'rem_002',
        patientId: 'pt_101',
        medicineName: 'Amlodipine 5mg',
        medicineNameMr: 'अॅम्लोडिपिन ५ मि.ग्रॅ.',
        dosage: '1 Tablet before sleep',
        dosageMr: 'झोपण्यापूर्वी १ गोळी',
        scheduledTime: '21:00',
        frequency: 'DAILY',
        status: 'UPCOMING',
        pillColorHex: '#10B981',
        active: true,
      },
    ],
    [
      'rem_003',
      {
        id: 'rem_003',
        patientId: 'pt_101',
        medicineName: 'Vitamin D3',
        medicineNameMr: 'व्हिटॅमिन डी३',
        dosage: '1 Capsule with warm milk',
        dosageMr: 'गरम दुधासोबत १ कॅप्सूल',
        scheduledTime: '08:00',
        frequency: 'DAILY',
        status: 'TAKEN',
        pillColorHex: '#F59E0B',
        active: true,
      },
    ],
  ]);

  private alerts: Map<string, CaregiverAlert> = new Map([
    [
      'alert_501',
      {
        alertId: 'alert_501',
        caregiverUid: 'cg_202',
        patientId: 'pt_101',
        patientName: 'Aaji (Mom)',
        type: 'MISSED_DOSE',
        severity: 'CRITICAL',
        message: 'Mom missed 09:00 AM Metformin dose by 45 minutes',
        messageMr: 'आईचे सकाळी ९:०० चे मेटफॉर्मिन औषध ४५ मिनिटे उशीर झाले आहे',
        timestamp: Date.now() - 2700000,
        acknowledged: false,
      },
    ],
  ]);

  async getTodaySchedules(patientId: string): Promise<MedicationSchedule[]> {
    return Array.from(this.schedules.values()).filter((s) => s.patientId === patientId && s.active);
  }

  async markAsTaken(patientId: string, reminderId: string): Promise<void> {
    const item = this.schedules.get(reminderId);
    if (!item || item.patientId !== patientId) {
      throw new NotFoundException(`Reminder ${reminderId} not found for patient ${patientId}`);
    }
    item.status = 'TAKEN';
    this.schedules.set(reminderId, item);
  }

  async createReminder(patientId: string, reminder: CreateMedicationScheduleDto): Promise<string> {
    const id = createId('rem');
    const newSchedule: MedicationSchedule = {
      ...reminder,
      id,
      patientId,
      status: 'UPCOMING',
    };
    this.schedules.set(id, newSchedule);
    return id;
  }

  async deleteReminder(patientId: string, reminderId: string): Promise<void> {
    const item = this.schedules.get(reminderId);
    if (!item || item.patientId !== patientId) {
      throw new NotFoundException(`Reminder ${reminderId} not found`);
    }
    item.active = false;
    this.schedules.set(reminderId, item);
  }

  async getPatientProfile(patientId: string): Promise<PatientProfile> {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient ${patientId} not found`);
    }
    return patient;
  }

  async updatePatientSettings(patientId: string, settings: Partial<PatientProfile['settings']>): Promise<void> {
    const patient = await this.getPatientProfile(patientId);
    patient.settings = { ...patient.settings, ...settings };
    this.patients.set(patientId, patient);
  }

  async getCaregiverAlerts(caregiverUid: string): Promise<CaregiverAlert[]> {
    return Array.from(this.alerts.values()).filter((a) => a.caregiverUid === caregiverUid);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    alert.acknowledged = true;
    this.alerts.set(alertId, alert);
  }

  async pairPatientWithCaregiver(patientLoginId: string, pin: string, caregiverUid: string): Promise<{ success: boolean; patientId: string }> {
    const pairing = this.pairings.get(patientLoginId);
    if (!pairing || pairing.pinHash !== pin) {
      throw new BadRequestException('Invalid Patient ID or PIN');
    }
    pairing.caregiverUid = caregiverUid;
    const caregiver = this.caregivers.get(caregiverUid);
    if (caregiver && !caregiver.monitoredPatients.includes(pairing.patientUid)) {
      caregiver.monitoredPatients.push(pairing.patientUid);
    }
    return { success: true, patientId: pairing.patientUid };
  }
}
