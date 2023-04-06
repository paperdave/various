import { delay } from '@paperdave/utils';
import { AuthOverride, getAuthHeaders } from './api-key';

export interface FetchOptions {
  /** Number of retries before giving up. Defaults to 3. */
  retry?: number;
  /** Override authentication settings. */
  auth?: AuthOverride;
}

export interface InternalFetchOptions extends FetchOptions {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  init?: RequestInit;
}

const base = 'https://api.openai.com/v1';

export async function fetchOpenAI(options: InternalFetchOptions) {
  const { endpoint, method, body, init, retry = 3, auth } = options;
  const url = `${base}${endpoint}`;
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...getAuthHeaders(auth),
  };
  const fullInit = {
    ...init,
    method,
    headers: {
      ...headers,
      ...init?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  let tries = 0;
  while (true) {
    try {
      const response = await fetch(url, fullInit);
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          await delay(parseInt(retryAfter, 10) * 1000);
        } else {
          await delay(1000);
        }
        continue;
      }
      if (response.status >= 400) {
        const error = await response.json();
        throw new Error(
          (error as any)?.error.message ??
            (typeof error === 'string' ? error : JSON.stringify(error))
        );
      }
      return response;
    } catch (error) {
      if (tries >= retry) {
        throw error;
      }
      tries++;
    }
  }
}
