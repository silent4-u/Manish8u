/**
 * Unit checks for the study rhythm shown on the home screen.
 * Run with `npm run test:streak`.
 */
import {
  activeDays,
  currentStreak,
  dayKey,
  goalPercent,
  questionsToday,
  recentDays,
} from '../src/lib/streak';
import type { AttemptRecord } from '../src/types';

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

/** A fixed "now" so these checks do not drift with the wall clock. */
const NOW = new Date(2026, 8, 7, 14, 30); // 7 September 2026, local time

/** An attempt finished `daysAgo` days before NOW, at midday. */
function at(daysAgo: number, total = 10): AttemptRecord {
  const d = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - daysAgo, 12, 0);
  return {
    id: `a${daysAgo}-${total}`,
    levelId: 'kharidar',
    mode: 'practice',
    subjectId: 'gk-nepal',
    total,
    correct: total,
    wrong: 0,
    skipped: 0,
    score: total,
    maxScore: total,
    seconds: 300,
    finishedAt: d.getTime(),
  };
}

console.log('dayKey');
check('pads month and day', dayKey(new Date(2026, 0, 5, 9, 0).getTime()), '2026-01-05');
check('is local, not UTC', dayKey(new Date(2026, 8, 7, 23, 59).getTime()), '2026-09-07');
check('an early hour stays on its own day', dayKey(new Date(2026, 8, 7, 0, 1).getTime()), '2026-09-07');

console.log('activeDays');
check('collapses several attempts on one day', activeDays([at(0), at(0, 5), at(2)]).size, 2);
check('no attempts, no days', activeDays([]).size, 0);

console.log('currentStreak');
check('nothing attempted', currentStreak([], NOW), 0);
check('today only', currentStreak([at(0)], NOW), 1);
check('today and yesterday', currentStreak([at(0), at(1)], NOW), 2);
check('four days running', currentStreak([at(0), at(1), at(2), at(3)], NOW), 4);
check('a gap ends the run', currentStreak([at(0), at(1), at(3), at(4)], NOW), 2);
check(
  'yesterday still counts before today is started',
  currentStreak([at(1), at(2)], NOW),
  2,
);
check('two days idle breaks it', currentStreak([at(2), at(3)], NOW), 0);
check('several attempts in a day count once', currentStreak([at(0), at(0, 5), at(1)], NOW), 2);
check('order does not matter', currentStreak([at(2), at(0), at(1)], NOW), 3);
check('an old run alone is not current', currentStreak([at(30), at(31), at(32)], NOW), 0);

console.log('questionsToday');
check('sums every paper sat today', questionsToday([at(0, 10), at(0, 20), at(1, 50)], NOW), 30);
check('nothing yet today', questionsToday([at(1, 50)], NOW), 0);
check('empty history', questionsToday([], NOW), 0);

console.log('recentDays');
check('most recent first', recentDays([at(0), at(2)], 4, NOW), [true, false, true, false]);
check('an empty history is all false', recentDays([], 3, NOW), [false, false, false]);
check('asks for none, gets none', recentDays([at(0)], 0, NOW), []);

console.log('goalPercent');
check('half way', goalPercent(10, 20), 50);
check('caps at a hundred', goalPercent(60, 20), 100);
check('nothing done', goalPercent(0, 20), 0);
check('a zero goal does not divide by zero', goalPercent(5, 0), 0);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll streak checks passed.');
