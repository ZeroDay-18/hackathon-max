export const questTypes = ['homework', 'lab', 'exam_prep', 'poll', 'personal'];

export const questTypeStyles = {
  homework: {
    icon: 'assignment',
    color: 'bg-violet-500/15 text-violet-300 ring-violet-400/20',
  },
  lab: {
    icon: 'science',
    color: 'bg-sky-500/15 text-sky-300 ring-sky-400/20',
  },
  exam_prep: {
    icon: 'school',
    color: 'bg-amber-500/15 text-amber-300 ring-amber-400/20',
  },
  poll: {
    icon: 'how_to_vote',
    color: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/20',
  },
  personal: {
    icon: 'person',
    color: 'bg-pink-500/15 text-pink-300 ring-pink-400/20',
  },
};

export function formatDeadline(value, locale = 'ru-RU') {
  if (!value) return null;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function isOverdue(quest) {
  return Boolean(
    quest.deadline &&
    !quest.progress?.completedAt &&
    new Date(quest.deadline).getTime() < Date.now(),
  );
}
