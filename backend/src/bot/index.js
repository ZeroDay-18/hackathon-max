import 'dotenv/config';
import { Bot, ScenarioEngine, session, Keyboard } from '@maxhub/max-bot-api';
import { onboardingScenario } from './scenarios/onboardingScenario.js';
import { questCreationScenario } from './scenarios/questCreationScenario.js';
import { findUserByMaxId } from '../services/user.service.js';
import { setBotDeliveryApi } from './delivery.service.js';

const bot = new Bot(process.env.MAX_BOT_TOKEN);
const scenarioEngine = new ScenarioEngine();
scenarioEngine.register(onboardingScenario);
scenarioEngine.register(questCreationScenario);
setBotDeliveryApi(bot.api);

function miniAppKeyboard() {
  if (!process.env.FRONTEND_URL) return undefined;
  return Keyboard.inlineKeyboard([
    [Keyboard.button.openApp('Открыть StudyQuest', process.env.FRONTEND_URL)],
  ]);
}

async function sendHelp(ctx) {
  await ctx.reply(
    'StudyQuest помогает вести задания и квесты.\n\n• /start — зарегистрироваться или открыть приложение\n• Отправьте текст задания — я предложу черновик через GigaChat\n• /cancel — отменить текущий сценарий\n\nЗадание создаётся только после вашего подтверждения.',
    { ...(miniAppKeyboard() && { attachments: [miniAppKeyboard()] }) },
  );
}

function getMessageText(ctx) {
  return ctx.update?.message?.body?.text?.trim() || '';
}

bot.use(session());
bot.use(scenarioEngine.middleware());

bot.use(async (ctx, next) => {
  try {
    const updateType = ctx.update?.update_type;
    const allowedEvents = ['message_created', 'message_callback', 'callback_query', 'bot_started'];

    if (!allowedEvents.includes(updateType) || ctx.scenario?.current) {
      return next();
    }

    const maxId = ctx.user?.user_id;
    const user = maxId ? await findUserByMaxId(maxId) : null;

    if (user) {
      ctx.session.isRegistered = true;
      return next();
    }

    if (updateType === 'message_created' && getMessageText(ctx) === '/help') {
      await sendHelp(ctx);
      return;
    }

    const startOnboarding = scenarioEngine.start(onboardingScenario, () => ({}));
    await startOnboarding(ctx, next);
  } catch (error) {
    console.error('Ошибка в корневом миддлваре:', error);
  }
});

bot.api.setMyCommands([
  { name: 'start', description: 'Открыть StudyQuest' },
  { name: 'help', description: 'Как пользоваться ботом' },
  { name: 'cancel', description: 'Отменить текущий сценарий' },
  { name: 'ping', description: 'Проверить связь' },
]);

bot.command('help', sendHelp);

bot.command('start', async (ctx) => {
  const user = ctx.user?.user_id ? await findUserByMaxId(ctx.user.user_id) : null;
  if (user) {
    await ctx.reply('Вы уже зарегистрированы. Откройте StudyQuest, чтобы видеть квесты, прогресс и уведомления.', {
      ...(miniAppKeyboard() && { attachments: [miniAppKeyboard()] }),
    });
  }
});

bot.command('cancel', async (ctx) => {
  await ctx.reply('Сейчас нет активного сценария. Отправьте текст задания, чтобы начать новый.');
});

bot.command('ping', async (ctx) => {
  await ctx.reply('pong');
});

bot.on('message_created', async (ctx) => {
  const text = getMessageText(ctx);
  const maxId = ctx.user?.user_id;

  if (!maxId || !text || text.startsWith('/') || ctx.scenario?.current) return;
  if (ctx.update?.message?.recipient?.chat_type !== 'dialog') return;

  const user = await findUserByMaxId(maxId);
  if (!user) return;

  const startQuestCreation = scenarioEngine.start(questCreationScenario, () => ({ originalText: text }));
  await startQuestCreation(ctx, async () => {});
});

bot.start();
