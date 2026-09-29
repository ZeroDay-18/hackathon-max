import { defineScenario, transition, Keyboard } from '@maxhub/max-bot-api';
import db from '../../models/index.js';
import { extractQuestDraft } from '../../services/gigachat.service.js';
import { notifyGroupAboutQuest } from '../../services/notification.service.js';
import { notifyGroupInBot, sendMiniAppEntryToUser } from '../delivery.service.js';

const Quest = db.quests;
const User = db.users;
const VALID_TYPES = ['homework', 'lab', 'exam_prep', 'personal'];

function getText(ctx) {
  return ctx.update?.message?.body?.text?.trim() || '';
}

async function acknowledge(ctx) {
  const callbackId = ctx.update?.callback?.callback_id;
  if (callbackId) await ctx.api.answerOnCallback(callbackId).catch(() => {});
}

function draftKeyboard() {
  return Keyboard.inlineKeyboard([
    [Keyboard.button.callback('Распознать задачу', 'quest-draft:parse')],
    [Keyboard.button.callback('Отмена', 'quest-draft:cancel')],
  ]);
}

function scopeKeyboard() {
  return Keyboard.inlineKeyboard([
    [
      Keyboard.button.callback('Только для меня', 'quest-draft:scope:personal'),
      Keyboard.button.callback('Для группы', 'quest-draft:scope:group'),
    ],
    [Keyboard.button.callback('Отмена', 'quest-draft:cancel')],
  ]);
}

function reviewKeyboard() {
  return Keyboard.inlineKeyboard([
    [Keyboard.button.callback('Создать квест', 'quest-draft:create')],
    [Keyboard.button.callback('Изменить', 'quest-draft:edit'), Keyboard.button.callback('Отмена', 'quest-draft:cancel')],
  ]);
}

function humanType(type) {
  return {
    homework: 'Домашняя работа',
    lab: 'Лабораторная работа',
    exam_prep: 'Подготовка к экзамену',
    personal: 'Личное задание',
  }[type] || 'Не указан';
}

function missingField(draft) {
  if (!draft.title) return 'title';
  if (!draft.subject) return 'subject';
  if (!draft.type) return 'type';
  if (!draft.scope) return 'scope';
  if (!draft.deadline) return 'deadline';
  return null;
}

function draftPreview(draft) {
  return [
    'Проверьте черновик:',
    `📌 Название: ${draft.title}`,
    `📚 Предмет: ${draft.subject || '—'}`,
    `🗂 Тип: ${humanType(draft.type)}`,
    `👥 Доступ: ${draft.scope === 'group' ? 'для группы' : 'только для меня'}`,
    `📅 Срок: ${draft.deadline ? new Date(draft.deadline).toLocaleString('ru-RU') : 'не указан'}`,
    `📝 Описание: ${draft.description || '—'}`,
  ].join('\n');
}

async function createQuestFromDraft({ user, draft }) {
  if (!draft.title || !VALID_TYPES.includes(draft.type) || !['group', 'personal'].includes(draft.scope)) {
    throw new Error('Черновик заполнен не полностью');
  }
  if (draft.scope === 'group' && !user.groupId) throw new Error('Для группового квеста нужна группа');
  if (draft.type === 'personal' && draft.scope !== 'personal') throw new Error('Личный тип доступен только для личного квеста');

  const quest = await db.sequelize.transaction(async (transaction) => {
    const createdQuest = await Quest.create({
      title: draft.title.slice(0, 255),
      description: draft.description?.slice(0, 4000) || null,
      subject: draft.subject?.slice(0, 120) || null,
      type: draft.type,
      deadline: draft.deadline || null,
      creatorId: user.id,
      groupId: draft.scope === 'group' ? user.groupId : null,
      assignedUserId: draft.scope === 'personal' ? user.id : null,
    }, { transaction });

    await notifyGroupAboutQuest({
      groupId: createdQuest.groupId,
      creatorId: user.id,
      quest: createdQuest,
      transaction,
    });
    return createdQuest;
  });

  void notifyGroupInBot({ groupId: quest.groupId, creatorId: user.id, quest });
  return quest;
}

export const questCreationScenario = defineScenario()({
  id: 'quest_creation',
  initialStep: 'consent',
  idleTimeoutMs: 30 * 60 * 1000,
  intercept: async ({ ctx }) => {
    const text = getText(ctx);
    if (text === '/cancel') {
      await ctx.reply('Создание квеста отменено.');
      return transition.cancel();
    }
    if (text === '/help') {
      await ctx.reply('Отправьте текст задания, подтвердите распознавание, а затем проверьте черновик перед созданием. /cancel — отмена.');
      return transition.stay();
    }
    return null;
  },
  steps: {
    consent: async (sctx) => {
      const payload = sctx.ctx.update?.callback?.payload;
      if (payload === 'quest-draft:cancel') {
        await acknowledge(sctx.ctx);
        await sctx.ctx.reply('Создание квеста отменено.');
        return transition.cancel();
      }
      if (payload !== 'quest-draft:parse') {
        await sctx.ctx.reply('Отправить текст в GigaChat для создания черновика? Задание не будет создано без вашего подтверждения.', { attachments: [draftKeyboard()] });
        return transition.stay();
      }

      await acknowledge(sctx.ctx);
      await sctx.ctx.reply('Распознаю задание…');
      try {
        const draft = await extractQuestDraft(sctx.data.originalText);
        return transition.goto('fillMissing', { draft });
      } catch (error) {
        console.error('GigaChat draft error:', error.message);
        await sctx.ctx.reply('Не удалось подготовить черновик. Попробуйте позже или отправьте текст заново.');
        return transition.cancel();
      }
    },

    fillMissing: async (sctx) => {
      const draft = { ...sctx.data.draft };
      const payload = sctx.ctx.update?.callback?.payload;
      const field = missingField(draft);

      if (!field) return transition.goto('review', { draft });
      if (field === 'scope') {
        if (payload === 'quest-draft:scope:personal' || payload === 'quest-draft:scope:group') {
          await acknowledge(sctx.ctx);
          draft.scope = payload.endsWith('group') ? 'group' : 'personal';
          return transition.goto('fillMissing', { draft });
        }
        await sctx.ctx.reply('Кому будет доступен квест?', { attachments: [scopeKeyboard()] });
        return transition.stay();
      }

      const text = getText(sctx.ctx);
      if (!text) {
        const questions = {
          title: 'Как назвать квест?',
          subject: 'По какому предмету это задание?',
          type: 'Выберите тип: homework, lab, exam_prep или personal.',
          deadline: 'Укажите срок в формате «2026-10-15 18:00».',
        };
        await sctx.ctx.reply(questions[field]);
        return transition.stay();
      }

      if (field === 'title') draft.title = text.slice(0, 255);
      if (field === 'subject') draft.subject = text.slice(0, 120);
      if (field === 'deadline') {
        const parsedDeadline = new Date(text);
        if (Number.isNaN(parsedDeadline.getTime())) {
          await sctx.ctx.reply('Не удалось распознать срок. Используйте формат «2026-10-15 18:00».');
          return transition.stay();
        }
        draft.deadline = parsedDeadline.toISOString();
      }
      if (field === 'type' && VALID_TYPES.includes(text)) draft.type = text;
      if (field === 'type' && !draft.type) {
        await sctx.ctx.reply('Используйте один из типов: homework, lab, exam_prep или personal.');
        return transition.stay();
      }
      return transition.goto('fillMissing', { draft });
    },

    review: async (sctx) => {
      const payload = sctx.ctx.update?.callback?.payload;
      if (payload === 'quest-draft:cancel') {
        await acknowledge(sctx.ctx);
        await sctx.ctx.reply('Создание квеста отменено.');
        return transition.cancel();
      }
      if (payload === 'quest-draft:edit') {
        await acknowledge(sctx.ctx);
        const nextDraft = { ...sctx.data.draft, title: null };
        await sctx.ctx.reply('Отправьте новое название квеста.');
        return transition.goto('fillMissing', { draft: nextDraft });
      }
      if (payload !== 'quest-draft:create') {
        await sctx.ctx.reply(draftPreview(sctx.data.draft), { attachments: [reviewKeyboard()] });
        return transition.stay();
      }

      await acknowledge(sctx.ctx);
      const maxId = sctx.ctx.user?.user_id;
      const user = await User.findOne({ where: { maxId: String(maxId) } });
      if (!user) {
        await sctx.ctx.reply('Не удалось найти ваш профиль. Откройте бота и отправьте /start.');
        return transition.cancel();
      }

      try {
        const quest = await createQuestFromDraft({ user, draft: sctx.data.draft });
        await sctx.ctx.reply(`✅ Квест «${quest.title}» создан.`);
        await sendMiniAppEntryToUser(user.maxId, 'Откройте StudyQuest, чтобы увидеть созданный квест.');
        return transition.complete();
      } catch (error) {
        console.error('Bot quest create error:', error.message);
        await sctx.ctx.reply('Не удалось создать квест. Попробуйте ещё раз позже.');
        return transition.cancel();
      }
    },
  },
});
