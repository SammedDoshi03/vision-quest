import { ApiError } from './types';

export const backoffDelay = (attempt: number, base = 300, cap = 4000): number => {
  const maxDelay = Math.min(cap, base * Math.pow(2, attempt));
  // Full jitter: random between 0 and maxDelay
  return Math.floor(Math.random() * maxDelay);
};

export function isRetryable(err: ApiError, method: string, hasIdempotencyKey: boolean): boolean {
  const isIdempotentMethod = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method.toUpperCase());
  return err.retryable && (isIdempotentMethod || hasIdempotencyKey);
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
