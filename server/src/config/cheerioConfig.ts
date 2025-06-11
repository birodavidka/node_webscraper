// src/config/cheerioConfig.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration for Cheerio-based scraping
 */
const cheerioSchema = z.object({
  // User-Agent to be used in HTTP requests
  CHEERIO_USER_AGENT: z.string().default(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  ),
  // HTTP request timeout in milliseconds
  CHEERIO_REQUEST_TIMEOUT: z
    .string()
    .transform((s) => parseInt(s, 10))
    .default('10000'),
});

export type CheerioConfig = z.infer<typeof cheerioSchema>;
export const cheerioConfig = cheerioSchema.parse(process.env);
