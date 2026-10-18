export interface IBiometricsBridge {
  isAvailable(): Promise<boolean>;
  authenticate(promptTitle: string): Promise<{ success: boolean; error?: string }>;
}

export interface ISecureKeystoreBridge {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

export interface IAlarmSchedulerBridge {
  requestExactAlarmPermission(): Promise<boolean>;
  scheduleAlarm(id: string, triggerTimeUtc: number, title: string, body: string): Promise<void>;
  cancelAlarm(id: string): Promise<void>;
}

export interface ICameraPermissionBridge {
  requestCameraAccess(): Promise<boolean>;
  hasCameraAccess(): Promise<boolean>;
}

export interface IHapticsBridge {
  impact(style: 'light' | 'medium' | 'heavy'): void;
  notification(type: 'success' | 'warning' | 'error'): void;
  selection(): void;
}

export interface INetworkStateBridge {
  isConnected(): Promise<boolean>;
  addConnectivityListener(callback: (isConnected: boolean) => void): () => void;
}

export interface IDeepLinkingBridge {
  getInitialURL(): Promise<string | null>;
  parseURL(url: string): { domain?: string; action?: string; params: Record<string, string> };
}

export interface IStoreReviewBridge {
  isAvailable(): Promise<boolean>;
  requestReview(): Promise<boolean>;
}

export class MockNativeBridge
  implements
    IBiometricsBridge,
    ISecureKeystoreBridge,
    IAlarmSchedulerBridge,
    ICameraPermissionBridge,
    IHapticsBridge,
    INetworkStateBridge,
    IDeepLinkingBridge,
    IStoreReviewBridge
{
  private store = new Map<string, string>();
  private onlineStatus = true;
  private connectivityListeners = new Set<(online: boolean) => void>();

  async isAvailable(): Promise<boolean> { return true; }
  async authenticate(promptTitle?: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async setItem(key: string, value: string) { this.store.set(key, value); }
  async getItem(key: string) { return this.store.get(key) || null; }
  async removeItem(key: string) { this.store.delete(key); }

  async requestExactAlarmPermission() { return true; }
  async scheduleAlarm(id: string, triggerTimeUtc: number, title: string, body: string) {
    console.log(`[MockNativeBridge] Alarm scheduled: ${title} at ${new Date(triggerTimeUtc).toISOString()}`);
  }
  async cancelAlarm(id: string) {
    console.log(`[MockNativeBridge] Cancelled alarm ${id}`);
  }

  async requestCameraAccess() { return true; }
  async hasCameraAccess() { return true; }

  impact(style: 'light' | 'medium' | 'heavy') {
    console.log(`[MockNativeBridge] Haptic impact triggered: ${style}`);
  }

  notification(type: 'success' | 'warning' | 'error') {
    console.log(`[MockNativeBridge] Haptic notification triggered: ${type}`);
  }

  selection() {
    console.log('[MockNativeBridge] Haptic selection triggered');
  }

  async isConnected() {
    return this.onlineStatus;
  }

  setMockOnlineStatus(status: boolean) {
    this.onlineStatus = status;
    this.connectivityListeners.forEach((cb) => cb(status));
  }

  addConnectivityListener(callback: (isConnected: boolean) => void) {
    this.connectivityListeners.add(callback);
    return () => {
      this.connectivityListeners.delete(callback);
    };
  }

  async getInitialURL(): Promise<string | null> {
    return 'resonance://medical?view=reminders';
  }

  parseURL(url: string) {
    const clean = url.replace('resonance://', '');
    const [pathPart, queryPart] = clean.split('?');
    const params: Record<string, string> = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
    }
    return {
      domain: pathPart ? pathPart.toUpperCase() : undefined,
      params,
    };
  }

  async requestReview(): Promise<boolean> {
    console.log('[MockNativeBridge] In-app store review dialog requested');
    return true;
  }
}

export const nativeBridge = new MockNativeBridge();
