import { defineScenario, transition, Keyboard } from '@maxhub/max-bot-api';
import { sendMiniAppEntryToUser } from '../delivery.service.js';
import { registerUser } from '../../services/user.service.js';

async function sendReply(sctx, text, options = {}) {
  const botCtx = sctx.ctx;
  const update = botCtx.update;

  const chatId =
    update?.message?.recipient?.chat_id ||
    update?.message?.chat?.chat_id ||
    update?.chat_id;

  const userId =
    update?.callback?.user?.user_id ||
    update?.message?.sender?.user_id ||
    update?.user?.user_id;

  try {
    if (chatId) {
      return await botCtx.api.sendMessageToChat(String(chatId), text, options);
    }

    if (userId) {
      return await botCtx.api.sendMessageToUser(String(userId), text, options);
    }
  } catch (error) {
    console.error('Ошибка API при отправке:', error.message);
  }
}

function getMaxUser(sctx) {
  const ctxUser = sctx.ctx.user;
  if (ctxUser) {
    return ctxUser;
  }

  const update = sctx.ctx.update;
  return update?.callback?.user || update?.message?.sender || update?.user;
}

function clearRegistrationSession(session) {
  if (!session) return;

  delete session.tempGroup;
  delete session.tempFirstName;
  delete session.tempLastName;
  delete session.confirmation;
}

export const onboardingScenario = defineScenario()({
  id: 'onboarding',
  initialStep: 'policy',
  intercept: async ({ ctx }) => {
    const text = ctx.update?.message?.body?.text?.trim();
    if (text === '/cancel') {
      await ctx.reply('Регистрация отменена. Отправьте /start, когда будете готовы продолжить.');
      return transition.cancel();
    }
    if (text === '/help') {
      await ctx.reply('Для регистрации подтвердите условия, укажите группу и затем фамилию с именем. /cancel — отмена.');
      return transition.stay();
    }
    return null;
  },
  steps: {
    policy: async (sctx) => {
      const payload = sctx.ctx.update?.callback?.payload;
      const callbackId = sctx.ctx.update?.callback?.callback_id;

      if (payload === 'accept-terms') {
        if (callbackId && typeof sctx.ctx.api.answerOnCallback === 'function') {
          try {
            await sctx.ctx.api.answerOnCallback(callbackId, 'Успешно!');
          } catch {}
        }

        if (sctx.ctx.session) {
          sctx.ctx.session.termsAccepted = true;
        }

        await sendReply(sctx, 'Спасибо! Условия успешно приняты ✅');
        await sendReply(
          sctx,
          'Давайте зарегистрируем вас. Сначала отправьте номер вашей группы (например: Б26-123-1):',
        );

        return transition.goto('enter_group');
      }

      const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback('Подтвердить ✅', 'accept-terms')],
      ]);

      await sendReply(
        sctx,
        '**Добро пожаловать!**\n\nПеред началом использования бота необходимо принять [Условия использования](https://hm.zerodayteam.space/terms) и [Политику конфиденциальности](https://hm.zerodayteam.space/privacy).\n\nНажимая _«Подтвердить»_, вы соглашаетесь с указанными документами.',
        { format: 'markdown', attachments: [keyboard] },
      );

      return transition.stay();
    },

    enter_group: async (sctx) => {
      const groupName = sctx.ctx.update?.message?.body?.text?.trim();

      if (!groupName) {
        await sendReply(sctx, 'Пожалуйста, отправьте номер вашей группы текстом (например: Б26-123-1):');
        return transition.stay();
      }

      if (groupName.length > 100) {
        await sendReply(sctx, 'Номер группы слишком длинный. Попробуйте ещё раз:');
        return transition.stay();
      }

      if (sctx.ctx.session) {
        sctx.ctx.session.tempGroup = groupName;
      }

      await sendReply(
        sctx,
        'Теперь введите **Фамилию и Имя** в формате:\n\n`Иван Иванов`\n\nСначала фамилия, затем имя.',
        { format: 'markdown' },
      );

      return transition.goto('enter_name');
    },

    enter_name: async (sctx) => {
      const fullName = sctx.ctx.update?.message?.body?.text?.trim();

      if (!fullName) {
        await sendReply(sctx, 'Пожалуйста, отправьте Фамилию и Имя текстом, например: Иван Иванов');
        return transition.stay();
      }

      const parts = fullName.split(/\s+/).filter(Boolean);

      if (parts.length !== 2) {
        await sendReply(
          sctx,
          '❌ Не удалось распознать данные. Введите Фамилию и Имя ровно в таком формате:\n\nИван Иванов',
        );
        return transition.stay();
      }

      const [lastName, firstName] = parts;

      if (lastName.length > 100 || firstName.length > 100) {
        await sendReply(sctx, 'Фамилия или имя слишком длинные. Попробуйте ещё раз:');
        return transition.stay();
      }

      if (sctx.ctx.session) {
        sctx.ctx.session.tempLastName = lastName;
        sctx.ctx.session.tempFirstName = firstName;
      }

      const groupName = sctx.ctx.session?.tempGroup;

      await sendReply(
        sctx,
        `Проверьте данные:\n\n👤 **Фамилия:** ${lastName}\n👤 **Имя:** ${firstName}\n🎓 **Группа:** ${groupName || '—'}\n\nВсё верно?`,
        {
          format: 'markdown',
          attachments: [
            Keyboard.inlineKeyboard([
              [
                Keyboard.button.callback('Да, всё верно ✅', 'registration-confirm'),
                Keyboard.button.callback('Нет, исправить ✏️', 'registration-restart'),
              ],
            ]),
          ],
        },
      );

      return transition.goto('confirm');
    },

    confirm: async (sctx) => {
      const payload = sctx.ctx.update?.callback?.payload;
      const callbackId = sctx.ctx.update?.callback?.callback_id;

      if (callbackId && typeof sctx.ctx.api.answerOnCallback === 'function') {
        try {
          await sctx.ctx.api.answerOnCallback(callbackId, {
            message: { text: payload === 'registration-confirm' ? 'Регистрируем...' : 'Начинаем заново' },
          });
        } catch {}
      }

      if (payload === 'registration-restart') {
        clearRegistrationSession(sctx.ctx.session);

        if (sctx.ctx.session) {
          sctx.ctx.session.termsAccepted = true;
        }

        await sendReply(sctx, 'Хорошо, давайте начнём заново 🔄');
        await sendReply(sctx, 'Отправьте номер вашей группы (например: Б26-123-1):');

        return transition.goto('enter_group');
      }

      if (payload !== 'registration-confirm') {
        await sendReply(sctx, 'Пожалуйста, выберите один из вариантов: «Да, всё верно» или «Нет, исправить».');
        return transition.stay();
      }

      const maxUser = getMaxUser(sctx);
      const maxId = maxUser?.user_id;
      const firstName = sctx.ctx.session?.tempFirstName;
      const lastName = sctx.ctx.session?.tempLastName;
      const groupName = sctx.ctx.session?.tempGroup;
      const acceptTerms = Boolean(sctx.ctx.session?.termsAccepted);

      if (!maxId || !firstName || !lastName || !groupName) {
        await sendReply(sctx, '❌ Данные регистрации потерялись. Давайте начнём заново.');
        clearRegistrationSession(sctx.ctx.session);

        if (sctx.ctx.session) {
          sctx.ctx.session.termsAccepted = true;
        }

        await sendReply(sctx, 'Отправьте номер вашей группы (например: Б26-123-1):');
        return transition.goto('enter_group');
      }

      await sendReply(sctx, '⏳ Регистрируем...');

      try {
        const result = await registerUser({
          maxId,
          firstName,
          lastName,
          groupName,
          acceptTerms,
          photoUrl: maxUser?.photo_url ?? null,
        });

        if (sctx.ctx.session) {
          sctx.ctx.session.isRegistered = true;
          clearRegistrationSession(sctx.ctx.session);
          delete sctx.ctx.session.termsAccepted;
        }

        if (!result.created) {
          await sendReply(sctx, '✅ Вы уже зарегистрированы. Повторная регистрация не требуется.');
          return transition.complete();
        }

        await sendReply(
          sctx,
          `✅ Регистрация завершена!\n\n👤 ${lastName} ${firstName}\n🎓 Группа: ${groupName}`,
        );
        await sendMiniAppEntryToUser(
          maxId,
          'Теперь StudyQuest готов к работе. Откройте приложение, чтобы видеть задания, прогресс и уведомления.\n\nМожно также отправить мне текст задания: сначала я покажу черновик, и только после вашего подтверждения создам квест.',
        );

        return transition.complete();
      } catch (error) {
        console.error('Ошибка регистрации пользователя:', error);
        await sendReply(sctx, '❌ Не удалось сохранить данные. Попробуйте ещё раз позже.');
        return transition.stay();
      }
    },
  },
});
