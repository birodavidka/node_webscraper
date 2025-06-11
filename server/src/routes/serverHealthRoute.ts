import express from 'express';

import { /* valamik a kontrollerből */ status, uptime} from '../controllers/serverHealthController';

const router = express.Router();

// Define the route for scraping
router.get('/server/uptime', uptime);
router.get('/server/status', status);

export default router;