// src/services/browserService.ts
import puppeteer, { Browser, LaunchOptions } from 'puppeteer';
import { puppeteerConfig } from '../config/puppeteerConfig';

/**
 * Launches a Puppeteer browser instance using shared configuration.
 * @returns {Promise<Browser>} The launched browser.
 */
export async function launchBrowser(): Promise<Browser> {
  const launchOptions: LaunchOptions = {
    headless: puppeteerConfig.PUPPETEER_HEADLESS,
    slowMo: puppeteerConfig.PUPPETEER_SLOW_MO,
    args: puppeteerConfig.PUPPETEER_ARGS,
  };

  return await puppeteer.launch(launchOptions);
}

/**
 * Creates and configures a new page from the given browser.
 * @param browser The Puppeteer Browser instance.
 * @returns {Promise<import('puppeteer').Page>} The configured page.
 */
export async function createPage(browser: Browser) {
  const page = await browser.newPage();
  // Set a default navigation timeout (e.g., 60 seconds)
  await page.setDefaultNavigationTimeout(60000);
  return page;
}
