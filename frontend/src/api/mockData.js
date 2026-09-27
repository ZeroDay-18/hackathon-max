// Моковые данные для отрисовки дизайна без бэкенда.
// Включаются только при VITE_USE_MOCKS=true (см. .env.example).
// Как только бэк отдаёт /api/tasks — этот файл можно удалить целиком.

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function at(offset) {
  return new Date(Date.now() + offset).toISOString()
}

export const MOCK_TASKS = [
  {
    id: '1',
    title: 'Скинуть в общий чат расписание пар на среду',
    done: false,
    dueAt: at(-3 * HOUR),
    tags: ['учёба'],
    source: 'max',
  },
  {
    id: '2',
    title: 'Забрать справки у деканата до конца дня',
    done: false,
    dueAt: at(5 * HOUR),
    tags: ['документы'],
    source: 'max',
  },
  {
    id: '3',
    title: 'Подготовить слайды к защите проекта',
    done: false,
    dueAt: at(7 * HOUR),
    tags: ['проект'],
    source: 'max',
  },
  {
    id: '4',
    title: 'Оплатить интернет до пятницы',
    done: false,
    dueAt: at(1.4 * DAY),
    tags: ['быт'],
    source: 'max',
  },
  {
    id: '5',
    title: 'Ответить Лёхе в MAX про поездку',
    done: false,
    dueAt: at(1.8 * DAY),
    tags: [],
    source: 'max',
  },
  {
    id: '6',
    title: 'Записаться к стоматологу',
    done: false,
    dueAt: at(3 * DAY),
    tags: ['здоровье'],
    source: 'max',
  },
  {
    id: '7',
    title: 'Собрать данные по дипломной части',
    done: false,
    dueAt: at(6 * DAY),
    tags: ['учёба', 'проект'],
    source: 'max',
  },
  {
    id: '8',
    title: 'Купить подарок на день рождения',
    done: false,
    dueAt: null,
    tags: [],
    source: 'max',
  },
  {
    id: '9',
    title: 'Сдать лабу по базам данных',
    done: true,
    dueAt: at(-DAY),
    tags: ['учёба'],
    source: 'max',
  },
  {
    id: '10',
    title: 'Прогулка после пар',
    done: true,
    dueAt: at(-2 * DAY),
    tags: [],
    source: 'max',
  },
]

export const MOCK_STATS = {
  doneTotal: 34,
  streak: 6,
  onTime: 88,
  perWeek: 7,
  guildProgress: 64,
  level: 4,
  xp: 260,
  xpToNext: 400,
}
