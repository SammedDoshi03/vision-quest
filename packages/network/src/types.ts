export interface TokenProvider {
  getAccessToken: () => Promise<string>;
  refresh: () => Promise<string>;
  clear: () => Promise<void>;
}

export type ApiErrorCode =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'rate_limited'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(opts: {
    message: string;
    code: ApiErrorCode;
    status: number;
    retryable: boolean;
    requestId?: string;
    details?: unknown;
  }) {
    super(opts.message);
    this.name = 'ApiError';
    this.code = opts.code;
    this.status = opts.status;
    this.retryable = opts.retryable;
    this.requestId = opts.requestId;
    this.details = opts.details;
  }
}

export interface ClientInfo {
  appVersion?: string;
  uiKitVersion?: string;
  platform?: 'ios' | 'android' | 'web';
  locale?: string;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  idempotencyKey?: string;
  skipAuth?: boolean;
  timeoutMs?: number;
}
