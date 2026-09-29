import db from '../models/index.js';
import { emotions, getQuadrant } from '../data/emotion-catalog.js';

const EmotionEntry = db.emotionEntries;

function inputError(code, message) {
  const error = new Error(message);
  error.code = code;
  error.status = 400;
  return error;
}
function integer(value, min, max, code) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw inputError(code, 'Некорректное значение');
  return number;
}
function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw inputError('INVALID_OCCURRED_AT', 'Некорректная дата');
  if (date.getTime() > Date.now() + 5 * 60 * 1000) throw inputError('FUTURE_OCCURRED_AT', 'Нельзя выбрать будущее время');
  return date;
}

export function normalizeEmotionEntry(payload) {
  const entryMethod = payload.entryMethod;
  const trigger = typeof payload.trigger === 'string' ? payload.trigger.trim() : '';
  if (!['thermometer', 'measurement'].includes(entryMethod)) throw inputError('INVALID_ENTRY_METHOD', 'Выберите способ оценки');
  if (!trigger || trigger.length > 1000) throw inputError('INVALID_TRIGGER', 'Укажите причину состояния');
  const base = { entryMethod, trigger, occurredAt: parseDate(payload.occurredAt) };

  if (entryMethod === 'thermometer') {
    const emotion = emotions.get(payload.emotionCode);
    if (!emotion || emotion.basicEmotionCode !== payload.basicEmotionCode) throw inputError('INVALID_EMOTION', 'Выберите эмоцию из списка');
    return { ...base, ...emotion };
  }

  const valence = integer(payload.valence, -5, 5, 'INVALID_VALENCE');
  if (valence === 0) throw inputError('INVALID_VALENCE', 'Ощущение не может быть нейтральным');
  const energy = integer(payload.energy, 1, 10, 'INVALID_ENERGY');
  return { ...base, basicEmotionCode: null, emotionCode: null, intensity: null, valence, energy, quadrant: getQuadrant(valence, energy) };
}

export function serializeEntry(entry) {
  return {
    id: entry.id,
    entryMethod: entry.entryMethod,
    basicEmotionCode: entry.basicEmotionCode,
    emotionCode: entry.emotionCode,
    intensity: entry.intensity,
    valence: entry.valence,
    energy: entry.energy,
    quadrant: entry.quadrant,
    trigger: entry.trigger,
    occurredAt: entry.occurredAt,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

export async function listEntries(userId) {
  const limit = 100;
  const entries = await EmotionEntry.findAll({ where: { userId }, order: [['occurredAt', 'DESC'], ['id', 'DESC']], limit: limit + 1 });
  return { entries: entries.slice(0, limit).map(serializeEntry), hasMore: entries.length > limit };
}
export async function createEntry(userId, payload) {
  return serializeEntry(await EmotionEntry.create({ userId, ...normalizeEmotionEntry(payload) }));
}
export async function updateEntry(userId, id, payload) {
  const entry = await EmotionEntry.findOne({ where: { id, userId } });
  if (!entry) return null;
  await entry.update(normalizeEmotionEntry(payload));
  return serializeEntry(entry);
}
export async function removeEntry(userId, id) {
  const entry = await EmotionEntry.findOne({ where: { id, userId } });
  if (!entry) return false;
  await entry.destroy();
  return true;
}

function normalizeTimezone(timezone) {
  const value = timezone || 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return value;
  } catch {
    throw inputError('INVALID_TIMEZONE', 'Некорректный часовой пояс');
  }
}
function dayKey(date, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function addDays(key, amount) {
  const date = new Date(`${key}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
export async function getSummary(userId, period, timezone) {
  const days = period === '30d' ? 30 : 7;
  const safeTimezone = normalizeTimezone(timezone);
  const today = dayKey(new Date(), safeTimezone);
  const firstDay = addDays(today, -days + 1);
  const entries = await EmotionEntry.findAll({ where: { userId }, order: [['occurredAt', 'DESC']] });
  const grouped = new Map();
  const distribution = { blue: 0, green: 0, red: 0, yellow: 0 };
  for (const entry of entries) {
    const key = dayKey(new Date(entry.occurredAt), safeTimezone);
    if (key < firstDay || key > today) continue;
    const list = grouped.get(key) || [];
    list.push(entry);
    grouped.set(key, list);
    distribution[entry.quadrant] += 1;
  }
  const timeline = Array.from({ length: days }, (_, index) => {
    const date = addDays(firstDay, index);
    const values = grouped.get(date) || [];
    const intensityEntries = values.filter((entry) => entry.intensity !== null);
    return {
      date,
      count: values.length,
      energy: values.length ? values.reduce((sum, entry) => sum + entry.energy, 0) / values.length : null,
      intensity: intensityEntries.length ? intensityEntries.reduce((sum, entry) => sum + entry.intensity, 0) / intensityEntries.length : null,
    };
  });
  return { period: `${days}d`, timezone: safeTimezone, total: [...grouped.values()].flat().length, distribution, timeline };
}
