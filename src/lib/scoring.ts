import type { Question } from '../types';

export interface AttemptSummary {
  correct: number;
  wrong: number;
  skipped: number;
  /** Marks earned after any negative marking, never below zero. */
  score: number;
  maxScore: number;
  /** Percentage of maxScore, rounded to a whole number. */
  percent: number;
  /** Correct answers as a percentage of questions actually attempted. */
  accuracy: number;
}

export interface MarkingScheme {
  marksPerQuestion: number;
  negativePerWrong: number;
}

const NO_PENALTY: MarkingScheme = { marksPerQuestion: 1, negativePerWrong: 0 };

/**
 * Score an attempt. `answers[i]` is the chosen option index for `questions[i]`,
 * or null when the question was left blank. Blank answers never attract a
 * penalty, which matches the Public Service Commission's practice, and the
 * total is floored at zero so a bad run never shows a negative score.
 */
export function scoreAttempt(
  answers: (number | null)[],
  questions: Question[],
  scheme: MarkingScheme = NO_PENALTY,
): AttemptSummary {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  questions.forEach((question, i) => {
    const answer = answers[i] ?? null;
    if (answer === null) skipped += 1;
    else if (answer === question.answer) correct += 1;
    else wrong += 1;
  });

  const raw = correct * scheme.marksPerQuestion - wrong * scheme.negativePerWrong;
  const score = Math.max(0, Math.round(raw * 100) / 100);
  const maxScore = questions.length * scheme.marksPerQuestion;
  const attempted = correct + wrong;

  return {
    correct,
    wrong,
    skipped,
    score,
    maxScore,
    percent: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
  };
}

/** mm:ss for a duration in seconds. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
