import { Telegraf, session, Markup, Context } from 'telegraf';
import { WizardScene, Stage, Scenes } from 'telegraf/scenes';
import { usedCars as exampleCars } from '../data/exampeData';
import { getDistanceRoute } from '../services/googleMapsService';

interface MySession {
  lang?: 'hu' | 'en' | 'de';
  currency?: 'HUF' | 'EUR';
  service?: 'rescue' | 'sales';
  rescueFrom?: string;
  rescueTo?: string;
  rescueFinalTo?: string;
  pageIndex?: number;
}

type MyContext = Scenes.WizardContext & Context & { session: MySession };

const bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_API!);
bot.use(session());

const stage = new Stage<MyContext>([]);
bot.use(stage.middleware());

const mainWizard = new WizardScene<MyContext>(
  'main-wizard',
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
  async (ctx) => {
    if (!ctx.callbackQuery || typeof ctx.callbackQuery.data !== 'string') return;
    const [, svc] = ctx.callbackQuery.data.split(':');
    ctx.session.service = svc as MySession['service'];
    await ctx.answerCbQuery();

    if (svc === 'rescue') {
      const text = ctx.session.lang === 'hu'
        ? 'Kérlek add meg a kiinduló pontot (A):'
        : ctx.session.lang === 'de'
          ? 'Bitte Startpunkt eingeben (A):'
          : 'Please enter the base address (A):';
      await ctx.reply(text);
      return ctx.wizard.next();
    } else {
      ctx.session.pageIndex = 0;
      await showCarCarousel(ctx, 0);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    ctx.session.rescueFrom = 'Szombathely';
    const prompt = ctx.session.lang === 'hu'
      ? 'Kérlek add meg a felvételi címet (B):'
      : ctx.session.lang === 'de'
        ? 'Bitte Abholadresse eingeben (B):'
        : 'Please enter the pickup address (B):';
    await ctx.reply(prompt);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.rescueTo = ctx.message?.text || '';
    const prompt = ctx.session.lang === 'hu'
      ? 'Ha a végcél Szombathely, csak nyomj Entert. Ha máshova szeretnél menni, kérlek írd be a címet (C):'
      : ctx.session.lang === 'de'
        ? 'Wenn das Ziel Szombathely ist, drücke einfach Enter. Gib sonst die Adresse ein (C):'
        : 'If the final destination is Szombathely, just press Enter. Otherwise, enter the destination (C):';
    await ctx.reply(prompt);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.rescueFinalTo = ctx.message?.text?.trim() || 'Szombathely';
    try {
      const result = await getDistanceRoute(
        ctx.session.rescueFrom!,
        ctx.session.rescueTo!,
        ctx.session.rescueFinalTo!
      );

      const numericKm = parseFloat(result.totalDistance);
      const kmRate = 250;
      const totalHUF = Math.round(numericKm * kmRate);

      const totalMinutes = parseInt(result.totalDuration.replace(/[^0-9]/g, '')) || 0;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedDuration = hours > 0 ? `${hours} óra ${minutes} perc` : `${minutes} perc`;

      const tarifainfo = ctx.session.lang === 'hu'
        ? `💸 Díj (${kmRate} Ft/km): ${totalHUF} Ft`
        : ctx.session.lang === 'de'
        ? `💸 Gebühr (${kmRate} Ft/km): ${totalHUF} Ft`
        : `💸 Fee (${kmRate} Ft/km): ${totalHUF} Ft`;

      const text = ctx.session.lang === 'hu'
        ? `Útvonal:\nA → B: ${result.abDistance} (${result.abDuration})\nB → C: ${result.bcDistance} (${result.bcDuration})\n\nÖsszesen: ${result.totalDistance}, kb. ${result.totalDuration}\n\n${tarifainfo}`
        : ctx.session.lang === 'de'
        ? `Route:\nA → B: ${result.abDistance} (${result.abDuration})\nB → C: ${result.bcDistance} (${result.bcDuration})\n\nGesamt: ${result.totalDistance}, ca. ${result.totalDuration}\n\n${tarifainfo}`
        : `Route:\nA → B: ${result.abDistance} (${result.abDuration})\nB → C: ${result.bcDistance} (${result.bcDuration})\n\nTotal: ${result.totalDistance}, approx. ${result.totalDuration}\n\n${tarifainfo}`;

      await ctx.reply(text);
    } catch (err) {
      await ctx.reply('❌ Hiba történt az útvonal lekérdezésekor.');
    }
    return ctx.scene.leave();
  }
);

stage.register(mainWizard);

export function initTelegramBot() {
  bot.command('start', (ctx) => ctx.scene.enter('main-wizard'));
  bot.launch().then(() => console.log('Telegram bot launched')).catch(console.error);
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

async function showCarCarousel(ctx: MyContext, page: number) {
  const cars = exampleCars;
  const pageSize = 4;
  const start = page * pageSize;
  const slice = cars.slice(start, start + pageSize);

  const media = slice.map(car => ({
    type: 'photo',
    media: car.photo1,
  }));

  await ctx.replyWithMediaGroup(media as any);

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

  await ctx.reply(`${titles}\n${distanceLabel}\n${priceLabel}`);
}
