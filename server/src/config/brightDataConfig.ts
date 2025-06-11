// src/config/brightDataConfig.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  BRIGHTDATA_API_KEY: z.string().nonempty(),
  BRIGHTDATA_ZONE: z.string().nonempty(),
});

export type BrightDataConfig = {
  apiKey: string;
  zone: string;
};

const parsed = schema.parse(process.env);
export const brightDataConfig: BrightDataConfig = {
  apiKey: parsed.BRIGHTDATA_API_KEY,
  zone: parsed.BRIGHTDATA_ZONE,
};
