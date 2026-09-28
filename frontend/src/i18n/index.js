import { createI18n } from 'vue-i18n';

const shared = {
  appName: 'StudyQuest',
  common: {
    retry: 'Повторить',
    cancel: 'Отмена',
    save: 'Сохранить',
    back: 'Назад',
    loading: 'Загрузка…',
    error: 'Не удалось загрузить данные. Попробуйте ещё раз.',
    noDeadline: 'Без срока',
    overdue: 'Срок истёк',
    today: 'Сегодня',
    tomorrow: 'Завтра',
  },
  nav: {
    home: 'Главная',
    quests: 'Задания',
    profile: 'Профиль',
  },
  dashboard: {
    greeting: 'Здравствуйте, {name}',
    subtitle: 'Вот что ждёт вас сегодня',
    nextDeadline: 'Ближайший срок',
    seeAll: 'Все задания',
    active: 'В работе',
    completed: 'Выполнено',
    empty: 'Сейчас нет активных заданий',
    create: 'Создать задание',
  },
  quests: {
    title: 'Задания',
    create: 'Создать задание',
    active: 'Активные',
    completed: 'Выполненные',
    allScopes: 'Все',
    groupScope: 'Группа',
    personalScope: 'Личные',
    empty: 'По этому фильтру заданий нет',
    detail: 'Подробности задания',
    description: 'Описание',
    deadline: 'Срок сдачи',
    creator: 'Создатель',
    group: 'Группа',
    personal: 'Личное задание',
    complete: 'Отметить выполненным',
    reopen: 'Вернуть в работу',
    edit: 'Редактировать',
    delete: 'Удалить',
    deleteConfirm: 'Удалить это задание?',
    pomodoroSessions: 'Сеансов фокусировки: {count}',
    types: {
      homework: 'Домашняя работа',
      lab: 'Лабораторная работа',
      exam_prep: 'Подготовка к экзамену',
      poll: 'Опрос группы',
      personal: 'Личное задание',
    },
  },
  createQuest: {
    title: 'Новое задание',
    titleLabel: 'Название',
    titlePlaceholder: 'Например, лабораторная работа № 2',
    descriptionLabel: 'Описание',
    descriptionPlaceholder: 'Что нужно сделать?',
    typeLabel: 'Тип',
    scopeLabel: 'Кому доступно',
    forGroup: 'Для всей группы',
    personal: 'Только мне',
    deadlineLabel: 'Срок сдачи',
    submit: 'Создать задание',
    required: 'Введите название задания',
  },
  timer: {
    title: 'Помодоро',
    work: 'Фокус',
    break: 'Перерыв',
    start: 'Старт',
    pause: 'Пауза',
    resume: 'Продолжить',
    reset: 'Сбросить',
    completed: 'Сеанс фокусировки завершён',
  },
  profile: {
    title: 'Профиль',
    group: 'Группа',
    languageMode: 'Стиль интерфейса',
    serious: 'Серьёзный',
    gamified: 'Игровой',
  },
};

function replaceTerms(value, replacements) {
  if (typeof value === 'string') {
    return replacements.reduce((result, [from, to]) => result.replaceAll(from, to), value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceTerms(item, replacements));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, replaceTerms(item, replacements)]),
  );
}

const messages = {
  'ru-serious': shared,
  'ru-game': replaceTerms(shared, [
    ['Задания', 'Квесты'],
    ['задания', 'квесты'],
    ['Задание', 'Квест'],
    ['задание', 'квест'],
    ['Группа', 'Гильдия'],
    ['группы', 'гильдии'],
    ['группе', 'гильдии'],
    ['группа', 'гильдия'],
    ['Домашняя работа', 'Квест на дом'],
    ['Лабораторная работа', 'Лабораторный квест'],
    ['Подготовка к экзамену', 'Подготовка к испытанию'],
    ['Опрос гильдии', 'Совет гильдии'],
    ['Личное задание', 'Личный квест'],
    ['Срок сдачи', 'Срок выполнения'],
  ]),
};

export default createI18n({
  legacy: false,
  locale: 'ru-serious',
  fallbackLocale: 'ru-serious',
  messages,
});
