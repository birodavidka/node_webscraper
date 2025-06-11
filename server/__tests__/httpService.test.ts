// src/services/httpService.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosConfig } from '../src/config/axiosConfig';

/**
 * Shared HTTP client configured with timeout, baseURL, and retry logic.
 */
export const httpClient = axios.create({
  baseURL: axiosConfig.HTTP_BASE_URL,
  timeout: axiosConfig.HTTP_TIMEOUT_MS,
});
describe('httpClient konfiguráció', () => {
  it('alapértelmezett timeout beállítás legyen 5000 ms', () => {
    expect(httpClient.defaults.timeout).toBe(5000);
  });
});
// Configure retries on failed requests
axiosRetry(httpClient, {
  retries: axiosConfig.HTTP_RETRY_COUNT,
  retryDelay: axiosRetry.exponentialDelay,
  // Log each retry attempt
  onRetry: (retryCount, error, requestConfig) => {
    console.log(
      `Retry #${retryCount} for ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`
    );
  },
});
