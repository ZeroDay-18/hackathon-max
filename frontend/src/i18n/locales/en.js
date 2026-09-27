// АНГЛИЙСКАЯ ЛОКАЛЬ = ОБЫЧНЫЙ РЕЖИМ, БЕЗ ГЕЙМИФИКАЦИИ
// Здесь «группы», задачи, сроки. Никаких квестов, уровней и маскота.
export default {
  mode: 'plain',

  app: {
    title: 'Taskbook',
    tagline: 'Plan. Do. Done.',
  },

  nav: {
    home: 'Home',
    tasks: 'Tasks',
    profile: 'Profile',
  },

  guild: {
    title: 'Group',
    subtitle: 'Your team',
    members: 'Members',
    level: 'Level',
    progress: 'Weekly progress',
  },

  home: {
    greeting: 'Hi',
    todayProgress: 'Today',
    nextDeadline: 'Next deadline',
    noDeadlines: 'No deadlines',
    goToTasks: 'All tasks',
    mascotHint: 'Summaries and deadlines in one place',
  },

  mascot: {
    caption: 'Your character',
    stage: 'Stage',
    level: 'Level',
    xpToNext: 'To next level: {xp} XP',
    maxLevel: 'Max level reached!',
  },

  stats: {
    title: 'Statistics',
    streak: 'Streak',
    streakUnit: 'd.',
    doneTotal: 'Completed',
    doneUnit: 'tasks',
    onTime: 'On time',
    perWeek: 'per week',
  },

  tasks: {
    title: 'Tasks',
    source: 'from MAX',
    empty: 'No tasks yet',
    emptyHint: 'Message the bot in MAX and it will turn your text into tasks',
    sections: {
      overdue: 'Overdue',
      today: 'Today',
      tomorrow: 'Tomorrow',
      later: 'Later',
      done: 'Completed',
    },
    markSectionDone: 'Complete all',
    progress: '{done} of {total}',
    relative: {
      overdueBy: '{time} overdue',
      inHours: 'in {time} h',
      inMinutes: 'in {time} min',
      inDays: 'in {time} d',
    },
    filters: {
      all: 'All',
      active: 'Active',
      done: 'Done',
    },
  },

  profile: {
    title: 'Profile',
    character: 'Character',
    characterHint: 'Character slot — your artwork goes here',
    stats: 'Statistics',
    comingSoon: 'Soon',
  },

  common: {
    loading: 'Loading…',
    retry: 'Retry',
    error: 'Something went wrong',
    offline: 'No connection to the server',
    cancel: 'Cancel',
  },
}
