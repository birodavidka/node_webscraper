// src/config/puppeteerConfig.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const puppeteerSchema = z.object({
  PUPPETEER_HEADLESS: z
    .string()
    .transform((s) => s === 'true')
    .default('true'),
  PUPPETEER_SLOW_MO: z
    .string()
    .transform((s) => parseInt(s, 10))
    .default('0'),
  PUPPETEER_ARGS: z
    .string()
    .default('--no-sandbox')
    .transform((s) => s.split(',').map((arg) => arg.trim())),
});

export type PuppeteerConfig = z.infer<typeof puppeteerSchema>;
export const puppeteerConfig = puppeteerSchema.parse(process.env);
