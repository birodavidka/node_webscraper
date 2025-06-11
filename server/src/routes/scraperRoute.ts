import express from 'express';

import { /* valamik a kontrollerből */ scrape} from '../controllers/scraperController';

const router = express.Router();

// Define the route for scraping
router.get('/scrape', scrape);

export default router;