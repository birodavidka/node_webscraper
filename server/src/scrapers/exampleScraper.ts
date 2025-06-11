// src/scrapers/exampleScraper.ts
import { launchBrowser, createPage } from '../services/browserService';
import { firestore } from '../config/firebaseConfig';
import { fetchViaBrightData } from '../services/brightDataService';

/**
 * Scrapes the given URL and saves the HTML content to Firestore.
 * Falls back to Bright Data API if Puppeteer navigation fails.
 * @param url - The target page URL to scrape.
 * @param collectionName - Firestore collection name for storing scraped pages.
 * @returns {Promise<string>} The Firestore document ID of the saved page.
 */
export async function scrapeAndSave(
  url: string,
  collectionName: string = 'scraped_pages'
): Promise<string> {
  let html: string;

  // First try Puppeteer
  try {
    const browser = await launchBrowser();
    try {
      const page = await createPage(browser);
      await page.goto(url, { waitUntil: 'networkidle2' });
      html = await page.content();
    } finally {
      await browser.close();
    }
  } catch (err: any) {
    console.warn(`Puppeteer scrape failed: ${err.message}. Falling back to Bright Data API.`);
    // Fallback to Bright Data API
    try {
      html = await fetchViaBrightData(url);
    } catch (apiErr) {
      console.error('Bright Data fallback failed:', apiErr);
      throw apiErr;
    }
  }

  // Save HTML to Firestore
  try {
    const docRef = await firestore
      .collection(collectionName)
      .add({ url, html, scrapedAt: new Date() });
    console.log(`Saved scraped page to Firestore with ID: ${docRef.id}`);
    return docRef.id;
  } catch (saveErr) {
    console.error('Error saving to Firestore:', saveErr);
    throw saveErr;
  }
}
