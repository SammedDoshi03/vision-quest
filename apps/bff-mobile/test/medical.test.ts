import test from 'node:test';
import assert from 'node:assert/strict';
import { MedicalService } from '../src/modules/medical/medical.service';
import { MedicalController } from '../src/modules/medical/medical.controller';
import { MedicationScheduleSchema, PatientProfileSchema } from '@internal/contracts';

test('MedicalService & MedicalController: full adherence and pairing lifecycle', async () => {
  const service = new MedicalService();
  const controller = new MedicalController(service);

  // 1. Fetch schedules for patient pt_101
  const schedules = await controller.getTodaySchedules('pt_101');
  assert.ok(schedules.length >= 2, 'Should have pre-seeded medication schedules');
  const metformin = schedules.find((s) => s.medicineName.includes('Metformin'));
  assert.ok(metformin, 'Metformin must exist');
  assert.strictEqual(metformin.status, 'DUE_NOW');

  // Verify Zod schema conformance
  for (const s of schedules) {
    MedicationScheduleSchema.parse(s);
  }

  // 2. Mark reminder as taken
  const takenResult = await controller.markAsTaken('pt_101', metformin.id);
  assert.strictEqual(takenResult.success, true);

  // Verify updated status
  const updatedSchedules = await controller.getTodaySchedules('pt_101');
  const updatedMetformin = updatedSchedules.find((s) => s.id === metformin.id);
  assert.strictEqual(updatedMetformin?.status, 'TAKEN');

  // 3. Fetch patient profile
  const profile = await controller.getPatientProfile('pt_101');
  PatientProfileSchema.parse(profile);
  assert.strictEqual(profile.emergencyContact.name, 'Rahul (Son)');
  assert.strictEqual(profile.preferredLanguage, 'mr');

  // 4. Fetch caregiver alerts
  const alerts = await controller.getCaregiverAlerts('cg_202');
  assert.ok(alerts.length >= 1, 'Should have pre-seeded critical alert');
  assert.strictEqual(alerts[0].severity, 'CRITICAL');

  // 5. Acknowledge alert
  const ackResult = await controller.acknowledgeAlert(alerts[0].alertId);
  assert.strictEqual(ackResult.success, true);

  // 6. Test 4-digit PIN pairing
  const pairingResult = await controller.pairPatient({
    patientLoginId: 'AAJI101',
    pin: '1234',
    caregiverUid: 'cg_202',
  });
  assert.strictEqual(pairingResult.success, true);
  assert.strictEqual(pairingResult.patientId, 'pt_101');
});
