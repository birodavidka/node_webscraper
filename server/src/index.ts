/* IMPORTS */
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { puppeteerConfig } from './config/puppeteerConfig';
import { brightDataConfig } from './config/brightDataConfig';
import {initTelegramBot} from './services/telegramBotService'
//import { uptime } from 'process';
import logger from './services/loggerService';

/* SETUP */
const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//app.use(morgan('common'));
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* IMPORT ROUTES */
import scraperRoute from './routes/scraperRoute';
import serverHealthRoute from './routes/serverHealthRoute';
import authRoute from './routes/authRoute';
import productRoute from './routes/productsRoute';

/* ROUTES */
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' });
});
app.use('/api', scraperRoute)
app.use('/health',serverHealthRoute); /* HEALTH CHECK */
app.use('/auth', authRoute); /* FIREBASE AUTH ROUTE */
app.use('/products', productRoute)

/* HEALTHCHECK */
/* app.get('/health', (_req, res) => {
  const uptimeInSeconds = uptime();
  const uptimeInHours = (uptimeInSeconds / 3600).toFixed(2);
  res.status(200).json({ status: 'ok', uptime: uptimeInHours  });
  console.log(`Server uptime: ${uptimeInHours} hours (${uptimeInSeconds} seconds)`);
});
 */


/* INITIALIZING TELEGRAM BOT */
initTelegramBot();


/* PUPPETEER CHECK */
console.log('puppeteer headless: ', puppeteerConfig.PUPPETEER_HEADLESS)

/* BRIGHT CHECK */
console.log('Using Bright Data API with zone:', brightDataConfig.zone);

/* SERVER RUNNING */
const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);