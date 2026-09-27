const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

/**
 * Относительное время дедлайна: «через 2 ч», «просрочено 3 дн».
 * Шаблон берём из i18n, чтобы ru/en отличались формулировкой.
 */
export function formatDeadline(dueAt, t, now = Date.now()) {
  if (!dueAt) return null

  const due = new Date(dueAt).getTime()
  const diff = due - now
  const abs = Math.abs(diff)

  if (abs < HOUR) {
    const n = Math.max(1, Math.round(abs / MINUTE))
    return diff < 0
      ? t('tasks.relative.overdueBy', { time: `${n}` })
      : t('tasks.relative.inMinutes', { time: `${n}` })
  }

  if (abs < 24 * HOUR) {
    const n = Math.round(abs / HOUR)
    return diff < 0
      ? t('tasks.relative.overdueBy', { time: `${n}` })
      : t('tasks.relative.inHours', { time: `${n}` })
  }

  const n = Math.round(abs / (24 * HOUR))
  return diff < 0
    ? t('tasks.relative.overdueBy', { time: `${n}` })
    : t('tasks.relative.inDays', { time: `${n}` })
}

export function isOverdue(dueAt, now = Date.now()) {
  if (!dueAt) return false
  return new Date(dueAt).getTime() < now
}

/** Сколько осталось до дедлайна в долях дня — для цвета бейджа */
export function urgency(dueAt, now = Date.now()) {
  if (!dueAt) return 'none'
  const diff = new Date(dueAt).getTime() - now
  if (diff < 0) return 'overdue'
  if (diff < 6 * HOUR) return 'soon'
  return 'later'
}
