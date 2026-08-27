/**
 * Unit checks for the marking rules. Run with `npm run test:scoring`.
 */
import { scoreAttempt, formatClock } from '../src/lib/scoring';
import type { Question } from '../src/types';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}\n        expected ${e}\n        actual   ${a}`);
  }
}

/** Five questions whose correct answer is always index 0. */
const questions: Question[] = Array.from({ length: 5 }, (_, i) => ({
  id: `t${i}`,
  subjectId: 'gk-nepal',
  levels: ['kharidar'],
  difficulty: 'easy',
  prompt: { en: 'q', ne: 'q' },
  options: [
    { en: 'a', ne: 'a' },
    { en: 'b', ne: 'b' },
    { en: 'c', ne: 'c' },
    { en: 'd', ne: 'd' },
  ],
  answer: 0,
  explanation: { en: 'e', ne: 'e' },
}));

const noPenalty = { marksPerQuestion: 1, negativePerWrong: 0 };
const kharidar = { marksPerQuestion: 2, negativePerWrong: 0.4 };

console.log('scoreAttempt');

check(
  'all correct, no penalty',
  scoreAttempt([0, 0, 0, 0, 0], questions, noPenalty),
  { correct: 5, wrong: 0, skipped: 0, score: 5, maxScore: 5, percent: 100, accuracy: 100 },
);

check(
  'all blank counts as skipped, not wrong',
  scoreAttempt([null, null, null, null, null], questions, noPenalty),
  { correct: 0, wrong: 0, skipped: 5, score: 0, maxScore: 5, percent: 0, accuracy: 0 },
);

check(
  'mixed answers with no penalty',
  scoreAttempt([0, 1, 0, null, 2], questions, noPenalty),
  { correct: 2, wrong: 2, skipped: 1, score: 2, maxScore: 5, percent: 40, accuracy: 50 },
);

check(
  'kharidar scheme: 3 right, 2 wrong = 6 - 0.8 = 5.2 of 10',
  scoreAttempt([0, 0, 0, 1, 1], questions, kharidar),
  { correct: 3, wrong: 2, skipped: 0, score: 5.2, maxScore: 10, percent: 52, accuracy: 60 },
);

check(
  'blanks are not penalised',
  scoreAttempt([0, 0, 0, null, null], questions, kharidar),
  { correct: 3, wrong: 0, skipped: 2, score: 6, maxScore: 10, percent: 60, accuracy: 100 },
);

check(
  'score is floored at zero, never negative',
  scoreAttempt([1, 1, 1, 1, 1], questions, kharidar),
  { correct: 0, wrong: 5, skipped: 0, score: 0, maxScore: 10, percent: 0, accuracy: 0 },
);

check(
  'accuracy ignores skipped questions',
  scoreAttempt([0, null, null, null, null], questions, noPenalty),
  { correct: 1, wrong: 0, skipped: 4, score: 1, maxScore: 5, percent: 20, accuracy: 100 },
);

check(
  'shorter answer array leaves the rest skipped',
  scoreAttempt([0], questions, noPenalty),
  { correct: 1, wrong: 0, skipped: 4, score: 1, maxScore: 5, percent: 20, accuracy: 100 },
);

check('empty paper does not divide by zero', scoreAttempt([], [], noPenalty), {
  correct: 0, wrong: 0, skipped: 0, score: 0, maxScore: 0, percent: 0, accuracy: 0,
});

console.log('formatClock');
check('zero', formatClock(0), '00:00');
check('under a minute', formatClock(45), '00:45');
check('exact minutes', formatClock(1500), '25:00');
check('negative clamps to zero', formatClock(-10), '00:00');

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll scoring checks passed.');
