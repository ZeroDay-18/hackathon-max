import { Op } from 'sequelize';
import db from '../models/index.js';

const Quest = db.quests;
const QuestProgress = db.questProgresses;
const User = db.users;
const Group = db.groups;

const questTypes = new Set(['homework', 'lab', 'exam_prep', 'poll', 'personal']);
const questIncludes = [
  { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'photoUrl'] },
  { model: Group, as: 'group', attributes: ['id', 'name'] },
  { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
];

function isAccessibleToUser(quest, user) {
  return quest.groupId === user.groupId || quest.assignedUserId === user.id;
}

function serializeQuest(quest) {
  const data = quest.toJSON();
  const progress = data.progresses?.[0] ?? null;

  delete data.progresses;

  return {
    ...data,
    progress: {
      pomodoroCount: progress?.pomodoroCount ?? 0,
      completedAt: progress?.completedAt ?? null,
    },
  };
}

function progressIncludeFor(userId) {
  return {
    model: QuestProgress,
    as: 'progresses',
    where: { userId },
    required: false,
    attributes: ['pomodoroCount', 'completedAt'],
  };
}

async function findAccessibleQuest(id, userId, options = {}) {
  const user = options.user || await User.findByPk(userId);
  if (!user) return null;

  const quest = await Quest.findByPk(id, {
    include: [...questIncludes, progressIncludeFor(user.id)],
  });

  if (!quest || !isAccessibleToUser(quest, user)) {
    return null;
  }

  return quest;
}

export async function createQuest(req, res, next) {
  try {
    const { title, description, type = 'homework', deadline, scope = 'group' } = req.body;
    const creator = req.user;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!questTypes.has(type)) {
      return res.status(400).json({ success: false, message: 'Unknown quest type' });
    }

    if (!['group', 'personal'].includes(scope)) {
      return res.status(400).json({ success: false, message: 'Unknown quest scope' });
    }

    if ((type === 'personal' && scope !== 'personal') || (type === 'poll' && scope !== 'group')) {
      return res.status(400).json({ success: false, message: 'Quest type is incompatible with scope' });
    }

    if (scope === 'group' && !creator.groupId) {
      return res.status(400).json({ success: false, message: 'User group is required' });
    }

    const quest = await Quest.create({
      title: title.trim(),
      description: description?.trim() || null,
      type,
      deadline: deadline || null,
      creatorId: creator.id,
      groupId: scope === 'group' ? creator.groupId : null,
      assignedUserId: scope === 'personal' ? creator.id : null,
    });

    const fullQuest = await Quest.findByPk(quest.id, {
      include: [...questIncludes, progressIncludeFor(creator.id)],
    });

    return res.status(201).json({ success: true, quest: serializeQuest(fullQuest) });
  } catch (error) {
    return next(error);
  }
}

export async function getQuests(req, res, next) {
  try {
    const { id: userId, groupId } = req.user;
    const quests = await Quest.findAll({
      where: {
        [Op.or]: [
          ...(groupId ? [{ groupId }] : []),
          { assignedUserId: userId },
        ],
      },
      include: [...questIncludes, progressIncludeFor(userId)],
      order: [['deadline', 'ASC NULLS LAST'], ['createdAt', 'DESC']],
    });

    return res.json({ success: true, quests: quests.map(serializeQuest) });
  } catch (error) {
    return next(error);
  }
}

export async function getQuestById(req, res, next) {
  try {
    const quest = await findAccessibleQuest(req.params.id, req.user.id, { user: req.user });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    return res.json({ success: true, quest: serializeQuest(quest) });
  } catch (error) {
    return next(error);
  }
}

export async function updateQuest(req, res, next) {
  try {
    const quest = await Quest.findByPk(req.params.id);

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    if (quest.creatorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the creator can edit this quest' });
    }

    const { title, description, type, deadline } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (type !== undefined && !questTypes.has(type)) {
      return res.status(400).json({ success: false, message: 'Unknown quest type' });
    }

    await quest.update({
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(type !== undefined && { type }),
      ...(deadline !== undefined && { deadline: deadline || null }),
    });

    const updatedQuest = await findAccessibleQuest(quest.id, req.user.id, { user: req.user });
    return res.json({ success: true, quest: serializeQuest(updatedQuest) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteQuest(req, res, next) {
  try {
    const quest = await Quest.findByPk(req.params.id);

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    if (quest.creatorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the creator can delete this quest' });
    }

    await quest.destroy();
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
}

export async function updateQuestProgress(req, res, next) {
  try {
    const quest = await findAccessibleQuest(req.params.id, req.user.id, { user: req.user });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    const { isCompleted } = req.body;
    const [progress] = await QuestProgress.findOrCreate({
      where: { questId: quest.id, userId: req.user.id },
      defaults: { completedAt: isCompleted ? new Date() : null },
    });

    if (isCompleted !== undefined) {
      await progress.update({ completedAt: isCompleted ? new Date() : null });
    }

    return res.json({
      success: true,
      progress: {
        pomodoroCount: progress.pomodoroCount,
        completedAt: progress.completedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function incrementPomodoro(req, res, next) {
  try {
    const quest = await findAccessibleQuest(req.params.id, req.user.id, { user: req.user });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    const [progress] = await QuestProgress.findOrCreate({
      where: { questId: quest.id, userId: req.user.id },
      defaults: { pomodoroCount: 0 },
    });

    await progress.increment('pomodoroCount');
    await progress.reload();

    return res.json({
      success: true,
      progress: {
        pomodoroCount: progress.pomodoroCount,
        completedAt: progress.completedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}
