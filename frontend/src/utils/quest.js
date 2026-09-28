export const questTypes = ['homework', 'lab', 'exam_prep', 'poll', 'personal'];

export const questTypeStyles = {
  homework: {
    icon: 'menu_book',
    color: 'bg-[#e8d7fb] text-[#7940c5] ring-[#d9bbf4]',
  },
  lab: {
    icon: 'science',
    color: 'bg-[#ede1ff] text-[#7651d5] ring-[#dac6ff]',
  },
  exam_prep: {
    icon: 'school',
    color: 'bg-[#ccecfb] text-[#1688bf] ring-[#a6dcf3]',
  },
  poll: {
    icon: 'how_to_vote',
    color: 'bg-[#fff0ce] text-[#b9770c] ring-[#f8dda1]',
  },
  personal: {
    icon: 'person',
    color: 'bg-[#e1f6ec] text-[#23805a] ring-[#c0e8d4]',
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
