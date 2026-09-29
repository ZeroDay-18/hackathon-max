import {
  createEntry,
  getSummary,
  listEntries,
  removeEntry,
  updateEntry,
} from '../services/emotion-diary.service.js';

function validId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
function sendKnownError(error, res, next) {
  if (error.status === 400) return res.status(400).json({ success: false, code: error.code, message: error.message });
  return next(error);
}

export async function listEmotionEntries(req, res, next) {
  try {
    const result = await listEntries(req.user.id);
    return res.json({ success: true, ...result });
  } catch (error) { return next(error); }
}
export async function createEmotionEntry(req, res, next) {
  try {
    return res.status(201).json({ success: true, entry: await createEntry(req.user.id, req.body) });
  } catch (error) { return sendKnownError(error, res, next); }
}
export async function updateEmotionEntry(req, res, next) {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, code: 'INVALID_ENTRY_ID', message: 'Некорректный идентификатор записи' });
  try {
    const entry = await updateEntry(req.user.id, id, req.body);
    if (!entry) return res.status(404).json({ success: false, code: 'EMOTION_ENTRY_NOT_FOUND', message: 'Запись не найдена' });
    return res.json({ success: true, entry });
  } catch (error) { return sendKnownError(error, res, next); }
}
export async function deleteEmotionEntry(req, res, next) {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ success: false, code: 'INVALID_ENTRY_ID', message: 'Некорректный идентификатор записи' });
  try {
    if (!(await removeEntry(req.user.id, id))) return res.status(404).json({ success: false, code: 'EMOTION_ENTRY_NOT_FOUND', message: 'Запись не найдена' });
    return res.json({ success: true });
  } catch (error) { return next(error); }
}
export async function getEmotionSummary(req, res, next) {
  const period = req.query.period === '30d' ? '30d' : '7d';
  try {
    return res.json({ success: true, summary: await getSummary(req.user.id, period, req.query.timezone) });
  } catch (error) { return sendKnownError(error, res, next); }
}
