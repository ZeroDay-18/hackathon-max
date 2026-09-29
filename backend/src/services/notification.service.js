import db from '../models/index.js';

const Notification = db.notifications;
const User = db.users;

export async function notifyGroupAboutQuest({ groupId, quest, creatorId, transaction }) {
  if (!groupId) return;

  const recipients = await User.findAll({
    where: { groupId },
    attributes: ['id'],
    transaction,
  });

  await Notification.bulkCreate(
    recipients
      .filter((user) => user.id !== creatorId)
      .map((user) => ({
        userId: user.id,
        questId: quest.id,
        type: 'quest_created',
        title: quest.type === 'poll' ? 'Новый опрос группы' : 'Новое задание',
        body: quest.title,
      })),
    { transaction },
  );
}

export async function notifyUserAboutCompletion({ userId, quest, transaction }) {
  await Notification.create({
    userId,
    questId: quest.id,
    type: 'quest_completed',
    title: 'Квест выполнен',
    body: quest.title,
  }, { transaction });
}
