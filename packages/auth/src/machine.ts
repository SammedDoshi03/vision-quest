import type { SessionUser } from '@internal/contracts';
import type { SecureStorage } from './storage';

export type AuthStatus =
  | 'bootstrapping'
  | 'unauthenticated'
  | 'otp_requested'
  | 'authenticating'
  | 'authenticated'
  | 'locked';

export interface AuthState {
  status: AuthStatus;
  user: SessionUser | null;
  phoneNumber?: string;
  error: string | null;
  biometricsEnabled: boolean;
}

export interface AuthMachineAdapters {
  storage: SecureStorage;
  requestOtpApi: (phoneNumber: string) => Promise<void>;
  verifyOtpApi: (phoneNumber: string, code: string) => Promise<{
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
  }>;
  verifyBiometricsApi?: () => Promise<boolean>;
}

export type AuthListener = (state: AuthState) => void;

export class AuthMachine {
  private state: AuthState = {
    status: 'bootstrapping',
    user: null,
    error: null,
    biometricsEnabled: false,
  };
  private listeners = new Set<AuthListener>();

  constructor(private adapters: AuthMachineAdapters) {}

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private emit(partial: Partial<AuthState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.getState()));
  }

  async bootstrap(): Promise<void> {
    try {
      const rt = await this.adapters.storage.get('refresh_token');
      const userJson = await this.adapters.storage.get('session_user');
      const bioEnabled = (await this.adapters.storage.get('biometrics_enabled')) === 'true';

      if (!rt || !userJson) {
        this.emit({ status: 'unauthenticated', user: null, biometricsEnabled: bioEnabled });
        return;
      }

      const user = JSON.parse(userJson) as SessionUser;

      if (bioEnabled) {
        this.emit({ status: 'locked', user, biometricsEnabled: true });
      } else {
        this.emit({ status: 'authenticated', user, biometricsEnabled: false });
      }
    } catch {
      this.emit({ status: 'unauthenticated', user: null, error: null });
    }
  }

  async requestOtp(phoneNumber: string): Promise<void> {
    this.emit({ status: 'authenticating', error: null });
    try {
      await this.adapters.requestOtpApi(phoneNumber);
      this.emit({ status: 'otp_requested', phoneNumber });
    } catch (err: unknown) {
      this.emit({ status: 'unauthenticated', error: (err as Error).message });
      throw err;
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<void> {
    this.emit({ status: 'authenticating', error: null });
    try {
      const result = await this.adapters.verifyOtpApi(phoneNumber, code);
      await this.adapters.storage.set('refresh_token', result.refreshToken);
      await this.adapters.storage.set('session_user', JSON.stringify(result.user));

      this.emit({
        status: 'authenticated',
        user: result.user,
        phoneNumber: undefined,
        error: null,
      });
    } catch (err: unknown) {
      this.emit({ status: 'otp_requested', error: (err as Error).message });
      throw err;
    }
  }

  async lock(): Promise<void> {
    if (this.state.status === 'authenticated') {
      this.emit({ status: 'locked' });
    }
  }

  async unlockWithBiometrics(): Promise<boolean> {
    if (this.state.status !== 'locked') return true;

    if (!this.adapters.verifyBiometricsApi) {
      this.emit({ status: 'authenticated' });
      return true;
    }

    try {
      const success = await this.adapters.verifyBiometricsApi();
      if (success) {
        this.emit({ status: 'authenticated', error: null });
        return true;
      } else {
        this.emit({ error: 'Biometric verification failed' });
        return false;
      }
    } catch (err) {
      this.emit({ error: (err as Error).message });
      return false;
    }
  }

  async signOut(): Promise<void> {
    await this.adapters.storage.delete('refresh_token');
    await this.adapters.storage.delete('session_user');
    this.emit({
      status: 'unauthenticated',
      user: null,
      phoneNumber: undefined,
      error: null,
    });
  }
}
