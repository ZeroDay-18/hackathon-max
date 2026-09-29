export const QUADRANTS = {
  blue: { label: 'Неприятно · низкая энергия', icon: 'cloud', tint: 'blue' },
  green: { label: 'Приятно · низкая энергия', icon: 'spa', tint: 'green' },
  red: { label: 'Неприятно · высокая энергия', icon: 'local_fire_department', tint: 'red' },
  yellow: { label: 'Приятно · высокая энергия', icon: 'wb_sunny', tint: 'yellow' },
};

export const QUADRANT_ACTIVITIES = {
  red: ['Бороться за свои права', 'Повышать информированность', 'Критиковать'],
  yellow: ['Вдохновляться', 'Решать творческие задачи', 'Генерировать новые идеи', 'Активно познавать'],
  blue: ['Редактировать документы', 'Писать отзывы', 'Проверять ошибки', 'Диагностировать проблемы', 'Найти, что пошло не так'],
  green: ['Договариваться', 'Внимательно слушать собеседника', 'Заниматься самоанализом'],
};

const rows = [
  ['expectation', 'Интерес', 'Ожидание', 'Настороженность', 4, 7, 9],
  ['joy', 'Безмятежность', 'Радость', 'Восторг', 2, 6, 9],
  ['trust', 'Принятие', 'Доверие', 'Восхищение', 3, 5, 8],
  ['fear', 'Тревога', 'Страх', 'Ужас', 5, 7, 10],
  ['surprise', 'Растерянность', 'Удивление', 'Изумление', 3, 6, 9],
  ['sorrow', 'Грусть', 'Печаль', 'Горе', 2, 4, 5],
  ['dissatisfaction', 'Скука', 'Недовольство', 'Отвращение', 1, 4, 7],
  ['anger', 'Досада', 'Злость', 'Гнев', 3, 7, 10],
  ['shame', 'Смущение', 'Стыд', 'Вина', 2, 4, 5],
];

const negative = new Set(['fear', 'surprise', 'sorrow', 'dissatisfaction', 'anger', 'shame']);

export function getQuadrant(valence, energy) {
  if (valence < 0) return energy <= 5 ? 'blue' : 'red';
  return energy <= 5 ? 'green' : 'yellow';
}

export const EMOTION_GROUPS = rows.map(([code, first, second, third, firstEnergy, secondEnergy, thirdEnergy]) => {
  const valence = negative.has(code) ? -4 : 4;
  return {
    code,
    label: second,
    icon: {
      expectation: 'schedule', joy: 'sentiment_very_satisfied', trust: 'handshake',
      fear: 'shield', surprise: 'lightbulb', sorrow: 'rainy', dissatisfaction: 'sentiment_dissatisfied',
      anger: 'local_fire_department', shame: 'visibility_off',
    }[code],
    emotions: [
      { code: `${code}-low`, label: first, intensity: 1, energy: firstEnergy },
      { code, label: second, intensity: 5, energy: secondEnergy },
      { code: `${code}-high`, label: third, intensity: 10, energy: thirdEnergy },
    ].map((emotion) => ({ ...emotion, basicCode: code, valence, quadrant: getQuadrant(valence, emotion.energy) })),
  };
});

export const EMOTIONS_BY_CODE = new Map(
  EMOTION_GROUPS.flatMap((group) => group.emotions.map((emotion) => [emotion.code, emotion])),
);
