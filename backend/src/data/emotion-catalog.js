const groups = [
  ['expectation', 'expectation-low', 'expectation', 'expectation-high', 4, 7, 9],
  ['joy', 'joy-low', 'joy', 'joy-high', 2, 6, 9],
  ['trust', 'trust-low', 'trust', 'trust-high', 3, 5, 8],
  ['fear', 'fear-low', 'fear', 'fear-high', 5, 7, 10],
  ['surprise', 'surprise-low', 'surprise', 'surprise-high', 3, 6, 9],
  ['sorrow', 'sorrow-low', 'sorrow', 'sorrow-high', 2, 4, 5],
  ['dissatisfaction', 'dissatisfaction-low', 'dissatisfaction', 'dissatisfaction-high', 1, 4, 7],
  ['anger', 'anger-low', 'anger', 'anger-high', 3, 7, 10],
  ['shame', 'shame-low', 'shame', 'shame-high', 2, 4, 5],
];
const negative = new Set(['fear', 'surprise', 'sorrow', 'dissatisfaction', 'anger', 'shame']);

export function getQuadrant(valence, energy) {
  if (valence < 0) return energy <= 5 ? 'blue' : 'red';
  return energy <= 5 ? 'green' : 'yellow';
}

export const emotions = new Map(groups.flatMap(([basicEmotionCode, ...items]) => {
  const [lowCode, middleCode, highCode, lowEnergy, middleEnergy, highEnergy] = items;
  const valence = negative.has(basicEmotionCode) ? -4 : 4;
  return [
    [lowCode, 1, lowEnergy],
    [middleCode, 5, middleEnergy],
    [highCode, 10, highEnergy],
  ].map(([emotionCode, intensity, energy]) => [
    emotionCode,
    { basicEmotionCode, emotionCode, intensity, valence, energy, quadrant: getQuadrant(valence, energy) },
  ]);
}));
