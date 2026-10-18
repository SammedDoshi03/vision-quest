import test from 'node:test';
import assert from 'node:assert/strict';
import { OfflineOutboxManager } from '../src/outbox';

test('OfflineOutboxManager: enqueues, preserves FIFO order, and flushes mutations with executor', async () => {
  const manager = new OfflineOutboxManager();

  const mut1 = await manager.enqueue('CREATE_ALARM', '/v1/medical/alarms', { title: 'Dose 1' });
  const mut2 = await manager.enqueue('UPDATE_ADHERENCE', '/v1/medical/adherence', { status: 'TAKEN' });

  assert.strictEqual(manager.getQueueLength(), 2);
  assert.strictEqual(manager.getPendingMutations().length, 2);

  const executed: string[] = [];

  const result = await manager.flushOutbox(async (m) => {
    executed.push(m.id);
  });

  assert.strictEqual(result.syncedCount, 2);
  assert.strictEqual(result.failedCount, 0);
  assert.strictEqual(manager.getQueueLength(), 0);
  assert.deepStrictEqual(executed, [mut1.id, mut2.id]);
});

test('OfflineOutboxManager: increments retryCount and records error when executor rejects', async () => {
  const manager = new OfflineOutboxManager();

  await manager.enqueue('FAILED_TX', '/v1/banking/transfer', { amount: 5000 });

  const result = await manager.flushOutbox(async () => {
    throw new Error('Network timeout (504 Gateway)');
  });

  assert.strictEqual(result.syncedCount, 0);
  assert.strictEqual(result.failedCount, 1);
  assert.strictEqual(manager.getQueueLength(), 1);

  const pending = manager.getPendingMutations();
  assert.strictEqual(pending[0].retryCount, 1);
  assert.strictEqual(pending[0].error, 'Network timeout (504 Gateway)');
});
