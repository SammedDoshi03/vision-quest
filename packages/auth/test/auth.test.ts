import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemorySecureStorage } from '../src/storage';
import { createTokenProvider, SessionExpiredError } from '../src/token-provider';
import { AuthMachine } from '../src/machine';

test('createTokenProvider refreshes token and persists new refresh token', async () => {
  const storage = new InMemorySecureStorage();
  await storage.set('refresh_token', 'initial_refresh');

  let refreshCallCount = 0;
  const mockApi = {
    refresh: async (rt: string) => {
      refreshCallCount++;
      assert.strictEqual(rt, 'initial_refresh');
      return { access: 'new_access', refresh: 'rotated_refresh' };
    },
  };

  const provider = createTokenProvider(mockApi, storage);
  const token = await provider.getAccessToken();

  assert.strictEqual(token, 'new_access');
  assert.strictEqual(refreshCallCount, 1);
  assert.strictEqual(await storage.get('refresh_token'), 'rotated_refresh');

  // Second call should return cached in-memory token without calling API
  const token2 = await provider.getAccessToken();
  assert.strictEqual(token2, 'new_access');
  assert.strictEqual(refreshCallCount, 1);
});

test('createTokenProvider throws SessionExpiredError when no refresh token exists', async () => {
  const storage = new InMemorySecureStorage();
  const provider = createTokenProvider({ refresh: async () => ({ access: '', refresh: '' }) }, storage);

  await assert.rejects(async () => {
    await provider.getAccessToken();
  }, SessionExpiredError);
});

test('AuthMachine lifecycle: requestOtp -> verifyOtp -> authenticated -> signOut', async () => {
  const storage = new InMemorySecureStorage();
  const machine = new AuthMachine({
    storage,
    requestOtpApi: async () => {},
    verifyOtpApi: async (phone, code) => {
      assert.strictEqual(code, '123456');
      return {
        user: { userId: 'u1', phoneNumber: phone, status: 'active', displayName: 'Asha' },
        accessToken: 'access_1',
        refreshToken: 'refresh_1',
      };
    },
  });

  await machine.bootstrap();
  assert.strictEqual(machine.getState().status, 'unauthenticated');

  await machine.requestOtp('+919876543210');
  assert.strictEqual(machine.getState().status, 'otp_requested');

  await machine.verifyOtp('+919876543210', '123456');
  assert.strictEqual(machine.getState().status, 'authenticated');
  assert.strictEqual(machine.getState().user?.displayName, 'Asha');

  await machine.signOut();
  assert.strictEqual(machine.getState().status, 'unauthenticated');
  assert.strictEqual(machine.getState().user, null);
});
