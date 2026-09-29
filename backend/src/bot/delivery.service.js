import { Keyboard } from '@maxhub/max-bot-api';
import db from '../models/index.js';

const User = db.users;
let botApi = null;

export function setBotDeliveryApi(api) {
  botApi = api;
}

function miniAppKeyboard() {
  if (!process.env.FRONTEND_URL) return undefined;

  return Keyboard.inlineKeyboard([
    [Keyboard.button.openApp('Открыть StudyQuest', process.env.FRONTEND_URL)],
  ]);
}

export async function sendMiniAppEntryToUser(maxId, text) {
  const recipientId = Number(maxId);
  if (!botApi || !Number.isSafeInteger(recipientId) || recipientId <= 0) return false;

  try {
    await botApi.sendMessageToUser(recipientId, text, {
      ...(miniAppKeyboard() && { attachments: [miniAppKeyboard()] }),
    });
    return true;
  } catch (error) {
    console.error('Unable to deliver MAX bot notification:', error.message);
    return false;
  }
}

export async function notifyGroupInBot({ groupId, creatorId, quest }) {
  if (!groupId || !botApi) return;

  try {
    const recipients = await User.findAll({
      where: { groupId },
      attributes: ['id', 'maxId'],
    });

    await Promise.allSettled(
      recipients
        .filter((recipient) => recipient.id !== creatorId)
        .map((recipient) => sendMiniAppEntryToUser(
          recipient.maxId,
          `📜 Новое задание: ${quest.title}`,
        )),
    );
  } catch (error) {
    console.error('Unable to prepare MAX bot notifications:', error.message);
  }
}
