import { Bot, Keyboard } from '@maxhub/max-bot-api';

const bot = new Bot(process.env.MAX_BOT_TOKEN);

// Установка подсказок с доступными командами
bot.api.setMyCommands([
  { 
    name: 'ping',
    description: 'Сыграть в пинг-понг'
  },
]);

// Обработчик события запуска бота
bot.on('bot_started', (ctx) => ctx.reply('Привет! Отправь мне команду /ping, чтобы сыграть в пинг-понг'));

// Обработчик команды '/ping'
bot.command('ping', (ctx) => ctx.reply('pong'));

// Обработчик для сообщения с текстом 'hello'
bot.hears('hello', (ctx) => ctx.reply('world'));

bot.command('policy', (ctx) => {
    const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback('Подтвердить ✅', 'accept-terms')],
    ]);


    ctx.reply("**Добро пожаловать!**\n\n" +
        "Перед началом использования бота необходимо принять [Условия использования](https://hm.zerodayteam.space/terms) и [Политику конфиденциальности](https://hm.zerodayteam.space/privacy).\n\n" +
        "Нажимая _«Подтвердить»_, вы соглашаетесь с указанными документами и подтверждаете, что ознакомились с ними.",
        { format: "markdown", attachments: [keyboard] })
})

// Обработчик для всех остальных входящих сообщений
bot.on('message_created', (ctx) => ctx.reply(ctx.message.body.text));

bot.start();

// 1. Цикл пока пользователь не согласится с условиями
// 2. Ввод нормера группы и мб ФИО
// 3. Уже есть доступ в мини-приложение


