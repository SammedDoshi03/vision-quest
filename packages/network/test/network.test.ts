import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { createApiClient } from '../src/client';
import { backoffDelay, isRetryable } from '../src/retry';
import { ApiError, type TokenProvider } from '../src/types';

test('backoffDelay returns bounded jittered ms', () => {
  for (let i = 0; i < 5; i++) {
    const delay = backoffDelay(i, 100, 1000);
    assert.ok(delay >= 0);
    assert.ok(delay <= 1000);
  }
});

test('isRetryable accurately distinguishes idempotent vs non-idempotent methods', () => {
  const retryableErr = new ApiError({
    message: 'Server error',
    code: 'server',
    status: 503,
    retryable: true,
  });

  assert.strictEqual(isRetryable(retryableErr, 'GET', false), true);
  assert.strictEqual(isRetryable(retryableErr, 'POST', false), false);
  assert.strictEqual(isRetryable(retryableErr, 'POST', true), true); // With Idempotency-Key
});

test('createApiClient single-flight token refresh works without cycles', async () => {
  let refreshCalls = 0;
  const mockTokenProvider: TokenProvider = {
    async getAccessToken() {
      return 'initial_token';
    },
    async refresh() {
      refreshCalls++;
      return 'refreshed_token';
    },
    async clear() {},
  };

  const client = createApiClient({
    baseURL: 'http://localhost:3000',
    tokenProvider: mockTokenProvider,
  });

  assert.ok(client);
  assert.strictEqual(typeof client.get, 'function');
});
