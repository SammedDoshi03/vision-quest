export interface OutboxMutation<T = any> {
  id: string;
  type: string;
  endpoint: string;
  payload: T;
  idempotencyKey: string;
  timestamp: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
  error?: string;
}

export interface OutboxStorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export class OfflineOutboxManager {
  private queue: OutboxMutation[] = [];
  private isFlushing = false;
  private readonly storageKey = 'enterprise_offline_outbox_queue_v1';
  private storageAdapter: OutboxStorageAdapter | null = null;

  constructor(storageAdapter?: OutboxStorageAdapter) {
    if (storageAdapter) {
      this.storageAdapter = storageAdapter;
      this.restoreQueue();
    }
  }

  private async restoreQueue() {
    if (!this.storageAdapter) return;
    try {
      const data = await this.storageAdapter.getItem(this.storageKey);
      if (data) {
        this.queue = JSON.parse(data);
      }
    } catch {
      // Fallback in-memory
    }
  }

  private async persistQueue() {
    if (!this.storageAdapter) return;
    try {
      await this.storageAdapter.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch {
      // Silent error
    }
  }

  async enqueue<T = any>(
    type: string,
    endpoint: string,
    payload: T,
    idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  ): Promise<OutboxMutation<T>> {
    const mutation: OutboxMutation<T> = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      endpoint,
      payload,
      idempotencyKey,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'PENDING',
    };

    this.queue.push(mutation);
    await this.persistQueue();
    return mutation;
  }

  getPendingMutations(): OutboxMutation[] {
    return this.queue.filter((m) => m.status === 'PENDING' || m.status === 'FAILED');
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  async flushOutbox(
    executor: (mutation: OutboxMutation) => Promise<void>
  ): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isFlushing) {
      return { syncedCount: 0, failedCount: 0 };
    }

    this.isFlushing = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const pending = this.getPendingMutations();

      for (const mutation of pending) {
        mutation.status = 'SYNCING';
        try {
          await executor(mutation);
          mutation.status = 'COMPLETED';
          syncedCount++;
          // Remove completed mutation from queue
          this.queue = this.queue.filter((m) => m.id !== mutation.id);
        } catch (err: any) {
          mutation.retryCount++;
          mutation.status = 'FAILED';
          mutation.error = err?.message || 'Sync failed';
          failedCount++;
          // Break FIFO chain if dependent or retry limit reached
          if (mutation.retryCount >= 5) {
            console.error(`[Outbox] Mutation ${mutation.id} exceeded max retries:`, mutation.error);
          }
        }
      }

      await this.persistQueue();
    } finally {
      this.isFlushing = false;
    }

    return { syncedCount, failedCount };
  }

  async clear(): Promise<void> {
    this.queue = [];
    if (this.storageAdapter) {
      await this.storageAdapter.removeItem(this.storageKey);
    }
  }
}

export const offlineOutbox = new OfflineOutboxManager();
