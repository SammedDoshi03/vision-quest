export interface OfflineAction {
  id: string;
  type: 'MARK_TAKEN' | 'CREATE_REMINDER' | 'ACKNOWLEDGE_ALERT';
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
}

export class OfflineAlarmScheduler {
  private scheduledAlarms: Map<string, { time: string; title: string; active: boolean }> = new Map();

  registerExactAlarm(reminderId: string, timeHHmm: string, title: string) {
    this.scheduledAlarms.set(reminderId, {
      time: timeHHmm,
      title,
      active: true,
    });
  }

  cancelAlarm(reminderId: string) {
    this.scheduledAlarms.delete(reminderId);
  }

  getPendingAlarms() {
    return Array.from(this.scheduledAlarms.entries()).map(([id, val]) => ({
      id,
      ...val,
    }));
  }
}

export const offlineAlarmScheduler = new OfflineAlarmScheduler();
