import { Scenes, Keyboard } from '@maxhub/max-bot-api';
const { BaseScene } = Scenes;

export const policyScene = new BaseScene('policy_scene');

const sendPolicy = async (ctx) => {
    const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback('Подтвердить ✅', 'accept-terms')],
    ]);

    await ctx.reply(
        "**Добро пожаловать!**\n\n" +
        "Перед началом использования бота необходимо принять [Условия использования](https://hm.zerodayteam.space/terms) и [Политику конфиденциальности](https://hm.zerodayteam.space/privacy).\n\n" +
        "Нажимая _«Подтвердить»_, вы соглашаетесь с указанными документами.",
        { format: "markdown", attachments: [keyboard] }
    );
};

policyScene.enter(sendPolicy);

policyScene.on('message_created', sendPolicy);
policyScene.on('bot_started', sendPolicy);

policyScene.action('accept-terms', async (ctx) => {
    await ctx.reply("Условия успешно приняты ✅");
    // await
    return ctx.scene.enter('registration_scene');
});