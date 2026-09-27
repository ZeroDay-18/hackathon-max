// АНГЛИЙСКАЯ ЛОКАЛЬ = ОБЫЧНЫЙ РЕЖИМ, БЕЗ ГЕЙМИФИКАЦИИ
// Здесь «группы», задачи, сроки. Никаких квестов, уровней и маскота.
export default {
  mode: 'plain',

  app: {
    title: 'StudyQuest',
    tagline: 'Your study quests in MAX',
  },

  nav: {
    home: 'Home',
    tasks: 'Quests',
    groups: 'Groups',
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
    goToTasks: 'All quests',
    mascotHint: 'Your mascot grows as you complete quests',
    deadlinePassed: 'Time is up',
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
    title: 'Quests',
    source: 'from MAX',
    empty: 'No quests yet',
    emptyHint: 'Message the bot in MAX and it will turn your text into quests',
    sections: {
      overdue: 'Overdue',
      today: 'Today',
      tomorrow: 'Tomorrow',
      later: 'Later',
      done: 'Completed',
    },
    markSectionDone: 'Complete all',
    progress: '{done} of {total}',
    tabs: {
      active: 'Active ({count})',
      done: 'Completed ({count})',
    },
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

  quest: {
    description: 'Description',
    deadline: 'Deadline',
    noDeadline: 'No deadline',
    status: {
      title: 'Status',
      not_started: 'Not started',
      in_progress: 'In progress',
      done: 'Completed',
    },
    start: 'Start quest',
    continue: 'Continue',
    completed: 'Completed',
    complete: {
      title: 'Quest completed!',
    },
    reward: 'Your reward',
    notFound: 'Quest not found',
  },

  time: {
    days: 'd',
  },

  profile: {
    title: 'Profile',
    character: 'Character',
    characterHint: 'Character slot — your artwork goes here',
    stats: 'Statistics',
    comingSoon: 'Soon',
  },

  groups: {
    title: 'Groups',
    empty: 'No groups yet',
    comingSoon: 'Section in development',
  },

  common: {
    loading: 'Loading…',
    retry: 'Retry',
    error: 'Something went wrong',
    offline: 'No connection to the server',
    cancel: 'Cancel',
    back: 'Back',
    settings: 'Settings',
  },
}
