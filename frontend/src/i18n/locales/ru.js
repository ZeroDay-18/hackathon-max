// РУССКАЯ ЛОКАЛЬ = РЕЖИМ С ГЕЙМИФИКАЦИЕЙ
// Здесь «гильдии», квесты, уровни, маскот, серии.
export default {
  mode: 'gamified',

  app: {
    title: 'Задачник',
    tagline: 'Делай — растёшь',
  },

  nav: {
    home: 'Главная',
    tasks: 'Квесты',
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

  profile: {
    title: 'Профиль',
    character: 'Персонаж',
    characterHint: 'Слот под маскота — сюда встанет твоя картинка',
    stats: 'Статистика',
    comingSoon: 'Скоро',
  },

  common: {
    loading: 'Загружаю…',
    retry: 'Повторить',
    error: 'Что-то пошло не так',
    offline: 'Нет связи с сервером',
    cancel: 'Отмена',
  },
}
