import { Op } from 'sequelize';
import db from '../models/index.js';
import { awardQuestCompletion } from '../services/progression.service.js';
import { notifyGroupAboutQuest, notifyUserAboutCompletion } from '../services/notification.service.js';
import { notifyGroupInBot } from '../bot/delivery.service.js';

const Quest = db.quests;
const QuestProgress = db.questProgresses;
const User = db.users;
const Group = db.groups;
const Poll = db.polls;
const PollOption = db.pollOptions;
const PollVote = db.pollVotes;

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

async function serializeQuestForUser(quest, userId) {
  const data = serializeQuest(quest);

  if (data.type !== 'poll') return data;

  const poll = await Poll.findOne({
    where: { questId: data.id },
    include: [{
      model: PollOption,
      as: 'options',
      include: [{ model: PollVote, as: 'votes', attributes: ['userId'] }],
    }],
    order: [[{ model: PollOption, as: 'options' }, 'position', 'ASC']],
  });

  if (!poll) return data;

  const pollData = poll.toJSON();
  data.poll = {
    id: pollData.id,
    question: pollData.question,
    totalVotes: pollData.options.reduce((total, option) => total + option.votes.length, 0),
    options: pollData.options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes.length,
      selected: option.votes.some((vote) => vote.userId === userId),
    })),
  };

  return data;
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
    const { title, description, subject, type = 'homework', deadline, scope = 'group', pollQuestion, pollOptions } = req.body;
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

    const normalizedOptions = Array.isArray(pollOptions)
      ? pollOptions.map((option) => String(option ?? '').trim()).filter(Boolean)
      : [];

    if (type === 'poll' && (!String(pollQuestion ?? '').trim() || normalizedOptions.length < 2 || normalizedOptions.length > 6)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_POLL',
        message: 'A poll needs a question and between 2 and 6 options',
      });
    }

    const quest = await db.sequelize.transaction(async (transaction) => {
      const createdQuest = await Quest.create({
        title: title.trim(),
        description: description?.trim() || null,
        subject: subject?.trim() || null,
        type,
        deadline: deadline || null,
        creatorId: creator.id,
        groupId: scope === 'group' ? creator.groupId : null,
        assignedUserId: scope === 'personal' ? creator.id : null,
      }, { transaction });

      if (type === 'poll') {
        const poll = await Poll.create({
          questId: createdQuest.id,
          question: String(pollQuestion).trim(),
        }, { transaction });
        await PollOption.bulkCreate(
          normalizedOptions.map((text, position) => ({ pollId: poll.id, text, position })),
          { transaction },
        );
      }

      await notifyGroupAboutQuest({
        groupId: createdQuest.groupId,
        quest: createdQuest,
        creatorId: creator.id,
        transaction,
      });

      return createdQuest;
    });

    void notifyGroupInBot({
      groupId: quest.groupId,
      creatorId: creator.id,
      quest,
    });

    const fullQuest = await Quest.findByPk(quest.id, {
      include: [...questIncludes, progressIncludeFor(creator.id)],
    });

    return res.status(201).json({ success: true, quest: await serializeQuestForUser(fullQuest, creator.id) });
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

    return res.json({
      success: true,
      quests: await Promise.all(quests.map((quest) => serializeQuestForUser(quest, userId))),
    });
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

    return res.json({ success: true, quest: await serializeQuestForUser(quest, req.user.id) });
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

    const { title, description, subject, type, deadline } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (type !== undefined && !questTypes.has(type)) {
      return res.status(400).json({ success: false, message: 'Unknown quest type' });
    }

    await quest.update({
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(subject !== undefined && { subject: subject?.trim() || null }),
      ...(type !== undefined && { type }),
      ...(deadline !== undefined && { deadline: deadline || null }),
    });

    const updatedQuest = await findAccessibleQuest(quest.id, req.user.id, { user: req.user });
    return res.json({ success: true, quest: await serializeQuestForUser(updatedQuest, req.user.id) });
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

    if (typeof req.body.isCompleted !== 'boolean') {
      return res.status(400).json({ success: false, code: 'INVALID_PROGRESS', message: 'isCompleted must be a boolean' });
    }

    const result = await db.sequelize.transaction(async (transaction) => {
      let progress = await QuestProgress.findOne({
        where: { questId: quest.id, userId: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!progress) {
        progress = await QuestProgress.create({
          questId: quest.id,
          userId: req.user.id,
          completedAt: null,
        }, { transaction });
      }

      let xpAwarded = 0;
      let progression = null;

      if (req.body.isCompleted && !progress.completedAt) {
        await progress.update({ completedAt: new Date() }, { transaction });
        const award = await awardQuestCompletion({ userId: req.user.id, quest, transaction });
        xpAwarded = award.xpAwarded;
        progression = award.progression;
        await notifyUserAboutCompletion({ userId: req.user.id, quest, transaction });
      } else if (!req.body.isCompleted && progress.completedAt) {
        await progress.update({ completedAt: null }, { transaction });
      }

      return { progress, xpAwarded, progression };
    });

    return res.json({
      success: true,
      progress: {
        pomodoroCount: result.progress.pomodoroCount,
        completedAt: result.progress.completedAt,
      },
      xpAwarded: result.xpAwarded,
      progression: result.progression,
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
