import db from '../models/index.js';

const UserProgression = db.userProgressions;
const ProgressionEvent = db.progressionEvents;

export const QUEST_REWARDS = {
  homework: { xp: 100, intelligence: 1, endurance: 1, reputation: 0 },
  lab: { xp: 150, intelligence: 2, endurance: 1, reputation: 0 },
  exam_prep: { xp: 200, intelligence: 2, endurance: 2, reputation: 0 },
  poll: { xp: 50, intelligence: 0, endurance: 0, reputation: 2 },
  personal: { xp: 100, intelligence: 1, endurance: 1, reputation: 0 },
};

export function getLevelInfo(xp) {
  const totalXp = Math.max(0, Number(xp) || 0);
  let level = 1;
  let levelStartXp = 0;
  let nextLevelXp = 100;

  while (totalXp >= nextLevelXp) {
    level += 1;
    levelStartXp = nextLevelXp;
    nextLevelXp += 200;
  }

  return {
    level,
    levelStartXp,
    nextLevelXp,
    xpIntoLevel: totalXp - levelStartXp,
    xpForNextLevel: nextLevelXp - levelStartXp,
    progressPercent: Math.round(((totalXp - levelStartXp) / (nextLevelXp - levelStartXp)) * 100),
  };
}

export function serializeProgression(progression) {
  const data = progression?.toJSON ? progression.toJSON() : progression || {};
  const levelInfo = getLevelInfo(data.xp);

  return {
    xp: data.xp ?? 0,
    level: levelInfo.level,
    ...levelInfo,
    stats: {
      intelligence: data.intelligence ?? 0,
      endurance: data.endurance ?? 0,
      reputation: data.reputation ?? 0,
    },
  };
}

export async function getOrCreateProgression(userId, transaction) {
  const [progression] = await UserProgression.findOrCreate({
    where: { userId },
    defaults: { userId },
    transaction,
  });

  return progression;
}

export async function awardQuestCompletion({ userId, quest, transaction }) {
  const reward = QUEST_REWARDS[quest.type] || QUEST_REWARDS.homework;
  const [event, created] = await ProgressionEvent.findOrCreate({
    where: {
      userId,
      source: 'quest_completion',
      sourceId: quest.id,
    },
    defaults: {
      userId,
      source: 'quest_completion',
      sourceId: quest.id,
      xp: reward.xp,
    },
    transaction,
  });

  const progression = await getOrCreateProgression(userId, transaction);

  if (created) {
    await progression.increment({
      xp: reward.xp,
      intelligence: reward.intelligence,
      endurance: reward.endurance,
      reputation: reward.reputation,
    }, { transaction });
    await progression.reload({ transaction });
  }

  return {
    xpAwarded: created ? reward.xp : 0,
    reward: created ? reward : null,
    event,
    progression: serializeProgression(progression),
  };
}
