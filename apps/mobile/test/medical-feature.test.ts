import test from 'node:test';
import assert from 'node:assert/strict';
import { offlineAlarmScheduler } from '@internal/contracts';

test('offlineAlarmScheduler: registers, queries, and cancels exact alarms', () => {
  offlineAlarmScheduler.registerExactAlarm('rem_test_01', '08:30', 'Morning Blood Pressure');
  
  const pending = offlineAlarmScheduler.getPendingAlarms();
  const found = pending.find((a) => a.id === 'rem_test_01');
  assert.ok(found, 'Should find registered alarm');
  assert.strictEqual(found.time, '08:30');
  assert.strictEqual(found.title, 'Morning Blood Pressure');

  offlineAlarmScheduler.cancelAlarm('rem_test_01');
  const pendingAfter = offlineAlarmScheduler.getPendingAlarms();
  assert.strictEqual(pendingAfter.find((a) => a.id === 'rem_test_01'), undefined);
});
