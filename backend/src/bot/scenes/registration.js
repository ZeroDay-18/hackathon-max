import { Scenes } from '@maxhub/max-bot-api';
const { BaseScene } = Scenes;

export const registrationScene = new BaseScene('registration_scene');

registrationScene.enter((ctx) => {
    ctx.reply("Теперь, пожалуйста, отправьте номер вашей группы (например: Б26-123-1):");
});

registrationScene.on('message_created', async (ctx) => {
    const userInput = ctx.message.body.text;
    
    // TODO: Здесь будет логика валидации и сохранения данных в PostgreSQL/Supabase
    console.log(`Получены данные пользователя: ${userInput}`);
    
    await ctx.reply(`Отлично! Ваши данные (${userInput}) сохранены.\n\nТеперь вам доступно мини-приложение и все команды бота.`);
    
    // Покидаем сцену, выпуская пользователя к обычным командам
    return ctx.scene.leave();
});