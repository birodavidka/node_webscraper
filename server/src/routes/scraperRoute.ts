import express from 'express';

import { /* valamik a kontrollerből */ testScrape} from '../controllers/scraperController';

const router = express.Router();

// Define the route for scraping
router.get('/puppeteer', testScrape);

export default router;