import 'dotenv/config';
import { Bot, ScenarioEngine, session } from '@maxhub/max-bot-api';
import { onboardingScenario } from './scenarios/onboardingScenario.js';
import { findUserByMaxId } from '../services/user.service.js';

const bot = new Bot(process.env.MAX_BOT_TOKEN);

const scenarioEngine = new ScenarioEngine();
scenarioEngine.register(onboardingScenario);

bot.use(session());
bot.use(scenarioEngine.middleware());

bot.use(async (ctx, next) => {
  try {
    const updateType = ctx.update?.update_type;
    const allowedEvents = ['message_created', 'message_callback', 'callback_query', 'bot_started'];

    if (!allowedEvents.includes(updateType)) {
      return await next();
    }

    if (ctx.scenario?.current) {
      return await next();
    }

    if (ctx.session?.isRegistered) {
      return await next();
    }

    const maxId = ctx.user?.user_id;

    if (maxId) {
      const user = await findUserByMaxId(maxId);

      if (user) {
        ctx.session.isRegistered = true;

        if (updateType === 'bot_started') {
          await ctx.api.sendMessageToChat(String(ctx.chatId), '✅ Вы уже зарегистрированы.');
        }

        return await next();
      }
    }

    const startOnboarding = scenarioEngine.start(onboardingScenario, () => ({}));
    await startOnboarding(ctx, next);

    return;
  } catch (error) {
    console.error('Ошибка в корневом миддлваре:', error);
  }
});

bot.api.setMyCommands([
  { name: 'ping', description: 'Сыграть в пинг-понг' },
]);

bot.command('ping', async (ctx) => {
  const chatId = ctx.update?.message?.recipient?.chat_id ||
                 ctx.update?.message?.chat?.chat_id ||
                 ctx.chatId;

  if (chatId) {
    await ctx.api.sendMessageToChat(String(chatId), 'pong');
  }
});

bot.start();
