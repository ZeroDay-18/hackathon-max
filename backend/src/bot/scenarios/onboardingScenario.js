import { defineScenario, transition, Keyboard } from '@maxhub/max-bot-api';

async function sendReply(sctx, text, options = {}) {
  const botCtx = sctx.ctx;
  const update = botCtx.update;

  const chatId = 
    update?.message?.recipient?.chat_id || 
    update?.message?.chat?.chat_id || 
    update?.chat_id;

  const userId = 
    update?.callback?.user?.user_id || 
    update?.message?.sender?.user_id;

  try {
    if (chatId) {
      return await botCtx.api.sendMessageToChat(String(chatId), text, options);
    } 
    if (userId) {
      return await botCtx.api.sendMessageToUser(String(userId), text, options);
    }
  } catch (error) {
    console.error(`❌ Ошибка API при отправке:`, error.message);
  }
}

export const onboardingScenario = defineScenario()({
  id: 'onboarding',
  initialStep: 'policy',
  steps: {
    policy: async (sctx) => {
      const update = sctx.ctx.update;
      
      const payload = update?.callback?.payload;
      const callbackId = update?.callback?.callback_id;

      if (payload === 'accept-terms') {
        if (callbackId && typeof sctx.ctx.api.answerOnCallback === 'function') {
          try {
            await sctx.ctx.api.answerOnCallback(callbackId, "Успешно!");
          } catch (e) {}
        }

        await sendReply(sctx, "Спасибо! Условия успешно приняты ✅");
        await sendReply(sctx, "Теперь, пожалуйста, отправьте номер вашей группы (например: Б26-123-1):");

        return transition.goto('enter_group');
      }

      const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback('Подтвердить ✅', 'accept-terms')],
      ]);

      await sendReply(
        sctx,
        "**Добро пожаловать!**\n\nПеред началом использования бота необходимо принять Условия использования и Политику конфиденциальности.\n\nНажимая _«Подтвердить»_, вы соглашаетесь с указанными документами.",
        { format: "markdown", attachments: [keyboard] } 
      );

      return transition.stay();
    },

    enter_group: async (sctx) => {
      const update = sctx.ctx.update;
      const group = update?.message?.body?.text?.trim();

      if (!group) {
        await sendReply(sctx, "Пожалуйста, отправьте номер вашей группы текстом (например: Б26-123-1):");
        return transition.stay();
      }

      // Сохраняем группу в состояние сценария
      // sctx.state.group = group;
      if (sctx.ctx.session) {
        sctx.ctx.session.tempGroup = group;
      }

      await sendReply(sctx, `Группа принята: ${group}\n\nТеперь отправьте ваше ФИО (например: Иванов Иван Иванович):`);
      return transition.goto('enter_fio');
    },

    enter_fio: async (sctx) => {
      const update = sctx.ctx.update;
      const fio = update?.message?.body?.text?.trim();

      if (!fio) {
        await sendReply(sctx, "Пожалуйста, отправьте ваше ФИО текстом:");
        return transition.stay();
      }

      const group = sctx.ctx.session?.tempGroup || "Не указана";
      await sendReply(sctx, "⏳ Проверяем данные...");

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await sendReply(
          sctx,
          `✅ Успешно!\n\n🎓 Группа: ${group}\n👤 ФИО: ${fio}\n\nРегистрация завершена.`
        );

        // Отмечаем пользователя зарегистрированным в сессии
        if (sctx.ctx.session) {
          sctx.ctx.session.isRegistered = true;
        }

        return transition.complete();
      } catch (error) {
        await sendReply(sctx, "❌ Ошибка. Давайте начнем с группы. Введите номер группы:");
        return transition.goto('enter_group');
      }
    },
  },
});