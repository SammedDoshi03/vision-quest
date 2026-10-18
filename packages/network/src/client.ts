import { z } from 'zod';
import { ApiError, type ApiErrorCode, type ClientInfo, type RequestConfig, type TokenProvider } from './types';
import { backoffDelay, delay, isRetryable } from './retry';

export interface ApiClientOptions {
  baseURL: string;
  tokenProvider?: TokenProvider;
  clientInfo?: ClientInfo;
  defaultTimeoutMs?: number;
  maxRetries?: number;
}

export function createApiClient(options: ApiClientOptions) {
  const {
    baseURL,
    tokenProvider,
    clientInfo = {},
    defaultTimeoutMs = 10000,
    maxRetries = 3,
  } = options;

  let refreshPromise: Promise<string> | null = null;

  async function resolveAccessToken(): Promise<string | null> {
    if (!tokenProvider) return null;
    try {
      return await tokenProvider.getAccessToken();
    } catch {
      return null;
    }
  }

  async function handleTokenRefresh(): Promise<string> {
    if (!tokenProvider) {
      throw new ApiError({
        message: 'No token provider configured',
        code: 'unauthorized',
        status: 401,
        retryable: false,
      });
    }

    if (!refreshPromise) {
      refreshPromise = tokenProvider.refresh().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  }

  async function executeRequest<T>(
    endpoint: string,
    config: RequestConfig = {},
    attempt = 0
  ): Promise<T> {
    const method = config.method || 'GET';
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Build URL with query params
    let url = `${baseURL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    if (config.params) {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(config.params)) {
        if (v !== undefined) sp.append(k, String(v));
      }
      const qs = sp.toString();
      if (qs) url += `?${qs}`;
    }

    // Build Headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'x-request-id': requestId,
      'x-app-version': clientInfo.appVersion || '1.0.0',
      'x-ui-kit-version': clientInfo.uiKitVersion || '1.0.0',
      'x-platform': clientInfo.platform || 'ios',
      'accept-language': clientInfo.locale || 'en-IN',
      ...(config.headers || {}),
    };

    if (config.body !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (config.idempotencyKey) {
      headers['Idempotency-Key'] = config.idempotencyKey;
    }

    if (!config.skipAuth) {
      const token = await resolveAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs || defaultTimeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as Error)?.name === 'AbortError';
      const apiErr = new ApiError({
        message: isAbort ? `Request timeout after ${config.timeoutMs || defaultTimeoutMs}ms` : 'Network connection failed',
        code: isAbort ? 'timeout' : 'network',
        status: 0,
        retryable: true,
        requestId,
      });

      if (attempt < maxRetries && isRetryable(apiErr, method, Boolean(config.idempotencyKey))) {
        await delay(backoffDelay(attempt));
        return executeRequest<T>(endpoint, config, attempt + 1);
      }
      throw apiErr;
    } finally {
      clearTimeout(timeout);
    }

    // Handle 401 Unauthorized single-flight retry
    if (response.status === 401 && !config.skipAuth && attempt === 0 && tokenProvider) {
      try {
        await handleTokenRefresh();
        return executeRequest<T>(endpoint, config, attempt + 1);
      } catch (refreshErr) {
        throw new ApiError({
          message: 'Session expired and refresh failed',
          code: 'unauthorized',
          status: 401,
          retryable: false,
          requestId,
          details: refreshErr,
        });
      }
    }

    // Non-2xx error mapping
    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      let code: ApiErrorCode = 'unknown';
      if (response.status === 401) code = 'unauthorized';
      else if (response.status === 403) code = 'forbidden';
      else if (response.status === 404) code = 'not_found';
      else if (response.status === 422 || response.status === 400) code = 'validation';
      else if (response.status === 429) code = 'rate_limited';
      else if (response.status >= 500) code = 'server';

      const isStatusRetryable = response.status === 429 || response.status >= 500;
      const apiErr = new ApiError({
        message: `HTTP ${response.status}: ${response.statusText}`,
        code,
        status: response.status,
        retryable: isStatusRetryable,
        requestId: response.headers.get('x-request-id') || requestId,
        details: errorBody,
      });

      if (attempt < maxRetries && isRetryable(apiErr, method, Boolean(config.idempotencyKey))) {
        await delay(backoffDelay(attempt));
        return executeRequest<T>(endpoint, config, attempt + 1);
      }

      throw apiErr;
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  return {
    async get<T>(
      endpoint: string,
      config: Omit<RequestConfig, 'method' | 'body'> & { schema?: z.ZodType<T> } = {}
    ): Promise<T> {
      const data = await executeRequest<T>(endpoint, { ...config, method: 'GET' });
      if (config.schema) {
        return config.schema.parse(data);
      }
      return data;
    },

    async post<T>(
      endpoint: string,
      body?: unknown,
      config: Omit<RequestConfig, 'method' | 'body'> & { schema?: z.ZodType<T> } = {}
    ): Promise<T> {
      const data = await executeRequest<T>(endpoint, { ...config, method: 'POST', body });
      if (config.schema) {
        return config.schema.parse(data);
      }
      return data;
    },

    async put<T>(
      endpoint: string,
      body?: unknown,
      config: Omit<RequestConfig, 'method' | 'body'> & { schema?: z.ZodType<T> } = {}
    ): Promise<T> {
      const data = await executeRequest<T>(endpoint, { ...config, method: 'PUT', body });
      if (config.schema) {
        return config.schema.parse(data);
      }
      return data;
    },

    async delete<T>(
      endpoint: string,
      config: Omit<RequestConfig, 'method' | 'body'> & { schema?: z.ZodType<T> } = {}
    ): Promise<T> {
      const data = await executeRequest<T>(endpoint, { ...config, method: 'DELETE' });
      if (config.schema) {
        return config.schema.parse(data);
      }
      return data;
    },
  };
}
