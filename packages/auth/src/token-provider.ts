import type { TokenProvider } from '@internal/network';
import type { SecureStorage } from './storage';

export interface AuthApi {
  refresh: (refreshToken: string) => Promise<{ access: string; refresh: string }>;
}

export class SessionExpiredError extends Error {
  constructor(message = 'Session has expired') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

export function createTokenProvider(api: AuthApi, storage: SecureStorage): TokenProvider {
  let accessToken: string | null = null;
  let inflight: Promise<string> | null = null;

  const refresh = (): Promise<string> => {
    if (inflight) return inflight;

    inflight = (async () => {
      const rt = await storage.get('refresh_token');
      if (!rt) {
        throw new SessionExpiredError();
      }

      try {
        const { access, refresh: rotated } = await api.refresh(rt);
        await storage.set('refresh_token', rotated);
        accessToken = access;
        return access;
      } catch (err) {
        await storage.delete('refresh_token');
        accessToken = null;
        throw err;
      }
    })().finally(() => {
      inflight = null;
    });

    return inflight;
  };

  return {
    getAccessToken: async (): Promise<string> => {
      if (accessToken) return accessToken;
      return refresh();
    },
    refresh,
    clear: async (): Promise<void> => {
      accessToken = null;
      await storage.delete('refresh_token');
    },
  };
}
