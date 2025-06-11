// src/services/httpService.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { axiosConfig } from '../config/axiosConfig';

// Ezek után nincs szükség @types/axios-retry telepítésére
const httpClient = axios.create({
  baseURL: axiosConfig.HTTP_BASE_URL,
  timeout: axiosConfig.HTTP_TIMEOUT_MS,
});

axiosRetry(httpClient, {
  retries: axiosConfig.HTTP_RETRY_COUNT,
  retryDelay: axiosRetry.exponentialDelay,
});

export default httpClient;
