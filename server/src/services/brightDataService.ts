// src/services/brightDataService.ts
import axios from 'axios';
import { brightDataConfig } from '../config/brightDataConfig';

/**
 * Fetches the target URL via Bright Data REST API.
 * @param url - The target page URL to fetch.
 * @param options Additional request options (e.g., format).
 * @returns The raw HTML/text response from the target URL.
 */
export async function fetchViaBrightData(
  url: string,
  options: { format?: 'raw' | 'json' } = { format: 'raw' }
): Promise<string> {
  const endpoint = 'https://api.brightdata.com/request';
  const payload = {
    zone: brightDataConfig.zone,
    url,
    format: options.format,
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${brightDataConfig.apiKey}`,
      },
    });

    // If format is 'raw', response.data is string; if 'json', it's parsed JSON
    if (options.format === 'raw') {
      return response.data as string;
    }
    return JSON.stringify(response.data);
  } catch (err) {
    console.error('Bright Data API error:', err);
    throw err;
  }
}
