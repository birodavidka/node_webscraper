// server/scripts/runScraper.ts
import '../src/config/firebaseConfig';   // hogy a .env-ből beolvasd a Firestorét
import { scrapeAndSave } from '../src/scrapers/exampleScraper';

(async () => {
  try {
    const id = await scrapeAndSave('https://www.subito.com', 'real_scraped_pages');
    console.log('LIVE: mentett doc ID:', id);
  } catch (err) {
    console.error('LIVE scrape hiba:', err);
  } finally {
    process.exit(0);
  }
})();
