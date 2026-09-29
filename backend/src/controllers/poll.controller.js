import db from '../models/index.js';
import { awardQuestCompletion } from '../services/progression.service.js';
import { notifyUserAboutCompletion } from '../services/notification.service.js';

const QuestProgress = db.questProgresses;

const Quest = db.quests;
const Poll = db.polls;
const PollOption = db.pollOptions;
const PollVote = db.pollVotes;

async function findAccessiblePoll(questId, user) {
  const quest = await Quest.findByPk(questId);

  if (!quest || quest.type !== 'poll' || quest.groupId !== user.groupId) {
    return null;
  }

  return Poll.findOne({ where: { questId } });
}

export async function voteInPoll(req, res, next) {
  try {
    const { optionId } = req.body;
    const questId = Number(req.params.questId);
    const optionIdNumber = Number(optionId);

    if (!Number.isSafeInteger(questId) || questId <= 0 || !Number.isSafeInteger(optionIdNumber) || optionIdNumber <= 0) {
      return res.status(400).json({ success: false, code: 'INVALID_POLL_OPTION', message: 'Invalid poll option' });
    }

    const poll = await findAccessiblePoll(req.params.questId, req.user);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    const option = await PollOption.findOne({ where: { id: optionIdNumber, pollId: poll.id } });
    if (!option) {
      return res.status(400).json({ success: false, code: 'INVALID_POLL_OPTION', message: 'Option does not belong to this poll' });
    }

    const completion = await db.sequelize.transaction(async (transaction) => {
      const vote = await PollVote.findOne({
        where: { pollId: poll.id, userId: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (vote) {
        await vote.update({ optionId: option.id }, { transaction });
      } else {
        await PollVote.create({ pollId: poll.id, optionId: option.id, userId: req.user.id }, { transaction });
      }

      const [progress] = await QuestProgress.findOrCreate({
        where: { questId: questId, userId: req.user.id },
        defaults: { questId, userId: req.user.id, completedAt: null },
        transaction,
      });

      if (!progress.completedAt) {
        await progress.update({ completedAt: new Date() }, { transaction });
        const award = await awardQuestCompletion({ userId: req.user.id, quest: await Quest.findByPk(questId, { transaction }), transaction });
        await notifyUserAboutCompletion({ userId: req.user.id, quest: await Quest.findByPk(questId, { transaction }), transaction });
        return award;
      }

      return { xpAwarded: 0, progression: null };
    });

    const options = await PollOption.findAll({
      where: { pollId: poll.id },
      include: [{ model: PollVote, as: 'votes', attributes: ['userId'] }],
      order: [['position', 'ASC']],
    });

    return res.json({
      success: true,
      xpAwarded: completion.xpAwarded,
      progression: completion.progression,
      poll: {
        id: poll.id,
        question: poll.question,
        totalVotes: options.reduce((total, item) => total + item.votes.length, 0),
        options: options.map((item) => ({
          id: item.id,
          text: item.text,
          votes: item.votes.length,
          selected: item.votes.some((vote) => vote.userId === req.user.id),
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
}
