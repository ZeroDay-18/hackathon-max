// РУССКАЯ ЛОКАЛЬ = РЕЖИМ С ГЕЙМИФИКАЦИЕЙ
// Здесь «гильдии», квесты, уровни, маскот, серии.
export default {
  mode: 'gamified',

  app: {
    title: 'StudyQuest',
    tagline: 'Твои учебные квесты в MAX',
  },

  nav: {
    home: 'Главная',
    tasks: 'Квесты',
    groups: 'Группы',
    profile: 'Профиль',
  },

  guild: {
    title: 'Гильдия',
    subtitle: 'Твоя команда',
    members: 'Участники',
    level: 'Уровень гильдии',
    progress: 'Прогресс за неделю',
  },

  home: {
    greeting: 'Привет',
    todayProgress: 'Сегодня',
    nextDeadline: 'Ближайший дедлайн',
    noDeadlines: 'Дедлайнов нет',
    goToTasks: 'Все квесты',
    mascotHint: 'Маскот растёт, пока ты закрываешь квесты',
    deadlinePassed: 'Время вышло',
  },

  mascot: {
    caption: 'Твой маскот',
    stage: 'Стадия',
    level: 'Уровень',
    xpToNext: 'До следующего уровня: {xp} ОП',
    maxLevel: 'Максимальный уровень!',
  },

  stats: {
    title: 'Статистика',
    streak: 'Серия',
    streakUnit: 'дн.',
    doneTotal: 'Выполнено',
    doneUnit: 'задач',
    onTime: 'Вовремя',
    perWeek: 'в неделю',
  },

  tasks: {
    title: 'Квесты',
    source: 'из MAX',
    empty: 'Квестов пока нет',
    emptyHint: 'Напиши боту в MAX — он превратит сообщение в квесты',
    sections: {
      overdue: 'Просрочено',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      later: 'Позже',
      done: 'Готово',
    },
    markSectionDone: 'Закрыть все',
    progress: '{done} из {total}',
    tabs: {
      active: 'Активные ({count})',
      done: 'Выполненные ({count})',
    },
    relative: {
      overdueBy: 'просрочено {time}',
      inHours: 'через {time} ч',
      inMinutes: 'через {time} мин',
      inDays: 'через {time} дн',
    },
    filters: {
      all: 'Все',
      active: 'Активные',
      done: 'Готово',
    },
  },

  quest: {
    description: 'Описание',
    deadline: 'Дедлайн',
    noDeadline: 'Без срока',
    status: {
      title: 'Статус',
      not_started: 'Не начато',
      in_progress: 'В процессе',
      done: 'Выполнено',
    },
    start: 'Начать выполнение',
    continue: 'Продолжить',
    completed: 'Выполнено',
    complete: {
      title: 'Квест выполнен!',
    },
    reward: 'Твоя награда',
    notFound: 'Квест не найден',
  },

  time: {
    days: 'дн',
  },

  profile: {
    title: 'Профиль',
    character: 'Персонаж',
    characterHint: 'Слот под маскота — сюда встанет твоя картинка',
    stats: 'Статистика',
    comingSoon: 'Скоро',
  },

  groups: {
    title: 'Группы',
    empty: 'Пока нет групп',
    comingSoon: 'Раздел в разработке',
  },

  common: {
    loading: 'Загружаю…',
    retry: 'Повторить',
    error: 'Что-то пошло не так',
    offline: 'Нет связи с сервером',
    cancel: 'Отмена',
    back: 'Назад',
    settings: 'Настройки',
  },
}
