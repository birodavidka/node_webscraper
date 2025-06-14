import { Telegraf, session, Markup, Context } from 'telegraf';
import { WizardScene, Stage, Scenes } from 'telegraf/scenes';
import { usedCars as exampleCars } from '../data/exampeData';  // fix named export import fileciteturn0file0  // Adjust path to your hardcoded data

// User session data
interface MySession {
  lang?: 'hu' | 'en' | 'de';
  currency?: 'HUF' | 'EUR';
  service?: 'rescue' | 'sales';
  rescueFrom?: string;
  rescueTo?: string;
  pageIndex?: number;
}

type MyContext = Scenes.WizardContext & Context & { session: MySession };

// Bot setup
const bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_API!);
bot.use(session());

// Stage setup for wizard scenes
const stage = new Stage<MyContext>([]);
bot.use(stage.middleware());

// Main wizard: language → currency → service → [rescue or sales]
const mainWizard = new WizardScene<MyContext>(
  'main-wizard',

  // 0. Nyelvválasztás
  async (ctx) => {
    await ctx.reply(
      'Kérlek, válassz nyelvet:\nPlease choose your language:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🇭🇺 Magyar', 'LANG:hu')],
        [Markup.button.callback('🇬🇧 English', 'LANG:en')],
        [Markup.button.callback('🇩🇪 Deutsch', 'LANG:de')]
      ])
    );
    return ctx.wizard.next();
  },

  // 1. Valuta választás
  async (ctx) => {
    if (!ctx.callbackQuery || typeof ctx.callbackQuery.data !== 'string') return;
    const [, lang] = ctx.callbackQuery.data.split(':');
    ctx.session.lang = lang as MySession['lang'];
    await ctx.answerCbQuery();

    const msg =
      ctx.session.lang === 'hu'
        ? 'Kérlek, válassz valutát:'
        : ctx.session.lang === 'de'
          ? 'Bitte Währung auswählen:'
          : 'Please choose your currency:';

    await ctx.reply(
      msg,
      Markup.inlineKeyboard([
        [Markup.button.callback('HUF', 'CUR:HUF')],
        [Markup.button.callback('EUR', 'CUR:EUR')]
      ])
    );
    return ctx.wizard.next();
  },

  // 2. Szolgáltatás választása
  async (ctx) => {
    if (!ctx.callbackQuery || typeof ctx.callbackQuery.data !== 'string') return;
    const [, cur] = ctx.callbackQuery.data.split(':');
    ctx.session.currency = cur as MySession['currency'];
    await ctx.answerCbQuery();

    const prompt =
      ctx.session.lang === 'hu'
        ? 'Válassz szolgáltatást:'
        : ctx.session.lang === 'de'
          ? 'Wähle Dienstleistung:'
          : 'Select a service:';

    await ctx.reply(
      prompt,
      Markup.inlineKeyboard([
        [Markup.button.callback(
          ctx.session.lang === 'hu' ? 'Autómentés/Fuvar' : ctx.session.lang === 'de' ? 'Bergung/Transport' : 'Rescue/Transport',
          'SVC:rescue'
        )],
        [Markup.button.callback(
          ctx.session.lang === 'hu' ? 'Eladó autók' : ctx.session.lang === 'de' ? 'Verkaufsautos' : 'Cars for sale',
          'SVC:sales'
        )]
      ])
    );
    return ctx.wizard.next();
  },

  // 3. Service ág
  async (ctx) => {
    if (!ctx.callbackQuery || typeof ctx.callbackQuery.data !== 'string') return;
    const [, svc] = ctx.callbackQuery.data.split(':');
    ctx.session.service = svc as MySession['service'];
    await ctx.answerCbQuery();

    if (svc === 'rescue') {
      // Rescue branch: ask for pickup location
      const text = ctx.session.lang === 'hu'
        ? 'Kérlek add meg a kiinduló pontot:'
        : ctx.session.lang === 'de'
          ? 'Bitte Abholort eingeben:'
          : 'Please enter the pickup location:';
      await ctx.reply(text);
      return ctx.wizard.next();

    } else {
      // Sales branch: show photo carousel using exampleData
      ctx.session.pageIndex = 0;
      await showCarCarousel(ctx, 0);
      return ctx.scene.leave();
    }
  },

  // 4. rescueFrom bekérés
  async (ctx) => {
    ctx.session.rescueFrom = ctx.message?.text || '';
    const prompt = ctx.session.lang === 'hu'
      ? 'Kérlek add meg a célállomást:'
      : ctx.session.lang === 'de'
        ? 'Bitte Zielort eingeben:'
        : 'Please enter the destination:';
    await ctx.reply(prompt);
    return ctx.wizard.next();
  },

  // 5. rescueTo bekérés + Quote
  async (ctx) => {
    ctx.session.rescueTo = ctx.message?.text || '';
    const price = computePrice(
      ctx.session.rescueFrom!,
      ctx.session.rescueTo!,
      ctx.session.currency!
    );
    const text = ctx.session.lang === 'hu'
      ? `Árajánlat: ${price} ${ctx.session.currency}`
      : ctx.session.lang === 'de'
        ? `Angebot: ${price} ${ctx.session.currency}`
        : `Quote: ${price} ${ctx.session.currency}`;
    await ctx.reply(text);
    return ctx.scene.leave();
  }
);

// Register scene
stage.register(mainWizard);

// Initialize bot
export function initTelegramBot() {
  bot.command('start', (ctx) => ctx.scene.enter('main-wizard'));
  bot.launch().then(() => console.log('Telegram bot launched')).catch(console.error);
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

// --- Helper functions ---

/**
 * Display a photo carousel of cars from exampleData
 */
async function showCarCarousel(ctx: MyContext, page: number) {
  const cars = exampleCars;
  // Pagination settings
  const pageSize = 4;
  const start = page * pageSize;
  const slice = cars.slice(start, start + pageSize);

  // Prepare media group array without captions
  const media = slice.map(car => ({
    type: 'photo',
    media: car.photo1,    // az exampleData-ban lévő kép-URL
  }));

  // Send media group (carousel)
  await ctx.replyWithMediaGroup(media as any);

  // After sending images, send a separate caption and buttons
  const titles = slice.map(car => `🚗 ${car.title}`).join("\n");
  const distanceLabel = slice.map(car =>
    ctx.session.lang === 'hu'
      ? `${car.mileage} km a központtól`
      : `${car.mileage} km from center`
  ).join("\n");
  const priceLabel = slice.map(car =>
    ctx.session.lang === 'hu'
      ? `${car.price} ${ctx.session.currency}`
      : `${car.price} ${ctx.session.currency}`
  ).join("\n");
/*   const dateLabel = slice.map(car =>
    `${new FormData(car.startDate, ctx.session.lang!)} – ${new FormData(car.endDate, ctx.session.lang!)}`
  ).join("\n"); */

  const caption = `${titles}\n${distanceLabel}\n${priceLabel}`;

  // Navigation buttons
  const buttons: any[] = [];
  if (start + pageSize < cars.length) {
    buttons.push(Markup.button.callback(
      ctx.session.lang === 'hu' ? '▶ Következő' : 'Next ▶',
      `CARSPAGE:${page + 1}`
    ));
  }
  if (page > 0) {
    buttons.push(Markup.button.callback(
      ctx.session.lang === 'hu' ? '◀ Előző' : '◀ Prev',
      `CARSPAGE:${page - 1}`
    ));
  }
  buttons.push(Markup.button.callback(
    ctx.session.lang === 'hu' ? '≡ Menü' : '≡ Menu',
    'MENU'
  ));

  await ctx.reply(caption, Markup.inlineKeyboard(buttons.map(b => [b])));
}

/**
 * Simple price computation
 */
function computePrice(from: string, to: string, cur: string): number {
  const base = 100;
  return Math.round(base + Math.random() * 200);
}
