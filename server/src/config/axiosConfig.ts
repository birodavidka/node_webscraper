// src/config/axiosConfig.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration schema for Axios HTTP client
 */
const axiosSchema = z.object({
  // Request timeout in milliseconds
  HTTP_TIMEOUT_MS: z
    .string()
    .transform((s) => parseInt(s, 10))
    .refine((n) => !isNaN(n), {
      message: 'HTTP_TIMEOUT_MS must be a number',
    })
    .default('5000'),
  // Number of retry attempts on failure
  HTTP_RETRY_COUNT: z
    .string()
    .transform((s) => parseInt(s, 10))
    .refine((n) => !isNaN(n), {
      message: 'HTTP_RETRY_COUNT must be a number',
    })
    .default('3'),
  // Optional base URL for all requests
  HTTP_BASE_URL: z.string().url().optional(),
});

export type AxiosConfig = z.infer<typeof axiosSchema>;
export const axiosConfig = axiosSchema.parse(process.env);
