import 'dotenv/config';
import { Bot, ScenarioEngine, session } from '@maxhub/max-bot-api';
import { onboardingScenario } from './scenarios/onboardingScenario.js';

const bot = new Bot(process.env.MAX_BOT_TOKEN);

const scenarioEngine = new ScenarioEngine();
scenarioEngine.register(onboardingScenario);

bot.use(session());
bot.use(scenarioEngine.middleware());

bot.use(async (ctx, next) => {
  try {
    const updateType = ctx.update?.update_type;

    // 1. Пропускаем технические ивенты (typing и т.д.), 
    // но ОБЯЗАТЕЛЬНО пускаем bot_started (кнопка Начать)
    const allowedEvents = ['message_created', 'callback_query', 'bot_started'];
    if (!allowedEvents.includes(updateType)) {
      return await next();
    }

    // 2. Если сценарий уже активен — отдаём обработку в scenarioEngine
    if (ctx.scenario?.current) {
      return await next();
    }

    // 3. Если пользователь не зарегистрирован — стартуем онбординг
    if (!ctx.session?.isRegistered) {
      const startOnboarding = scenarioEngine.start(onboardingScenario, () => ({}));
      await startOnboarding(ctx, next);
      
      // Прерываем дальнейшее выполнение, чтобы бот не реагировал на обычные команды
      return; 
    }

    return await next();
  } catch (error) {
    console.error('Ошибка в корневом миддлваре:', error);
    return await next();
  }
});

bot.api.setMyCommands([
  { name: 'ping', description: 'Сыграть в пинг-понг' },
]);

bot.command('ping', async (ctx) => {
  const chatId = ctx.update?.message?.chat?.chat_id || ctx.update?.message?.sender?.user_id;
  if (chatId) {
     await ctx.api.sendMessageToChat(String(chatId), 'pong');
  }
});

bot.start();