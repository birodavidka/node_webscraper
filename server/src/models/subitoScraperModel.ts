/**
 * src/models/ScraperModel.ts
 *
 * Defines the data model and scraper interface for scraping modules.
 */

/**
 * Represents a single scraped item from a listing.
 */
export interface ScrapeItem {
  /** URL of the listing */
  url: string;
  /** Array of image URLs for the listing */
  images: string[];
  /** Price as displayed on the site (e.g., "€15,000") */
  price: string;
  /** Manufacturing year (YYYY) */
  year: string;
  /** Fuel type (e.g., "Diesel", "Petrol") */
  fuel: string;
  /** Mileage text (e.g., "120,000 km") */
  mileage: string;
}

/**
 * Interface that all scraper modules must implement.
 */
export interface IScraper {
  /**
   * Performs the scraping process and returns an array of scraped items.
   * @returns Promise resolving to a list of ScrapeItem objects
   */
  scrape(): Promise<ScrapeItem[]>;
}
