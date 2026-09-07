import type { Question } from '../../types';
import { constitutionQuestions } from './constitution';
import { gkNepalQuestions } from './gkNepal';
import { governanceQuestions } from './governance';
import { officeEconomyQuestions } from './officeEconomy';
import { worldIctQuestions } from './worldIct';
import { iqQuestions } from './iq';
import { languageQuestions } from './language';
import { currentAffairsQuestions } from './currentAffairs';
import { bostQuestions } from './bost';
import { mathsQuestions } from './maths';

export const QUESTIONS: Question[] = [
  ...constitutionQuestions,
  ...gkNepalQuestions,
  ...governanceQuestions,
  ...officeEconomyQuestions,
  ...worldIctQuestions,
  ...iqQuestions,
  ...languageQuestions,
  ...currentAffairsQuestions,
  ...bostQuestions,
  ...mathsQuestions,
];

export function questionsFor(levelId: string, subjectId?: string | null): Question[] {
  return QUESTIONS.filter(
    (q) =>
      q.levels.includes(levelId as Question['levels'][number]) &&
      (!subjectId || q.subjectId === subjectId),
  );
}

/**
 * Every question on a subject, whatever post it was written for. The first
 * paper hub is deliberately not level-filtered: a candidate may want to work
 * a topic that sits on another post's paper.
 */
export function questionsBySubject(subjectId: string): Question[] {
  return QUESTIONS.filter((q) => q.subjectId === subjectId);
}

/** Deterministic-enough shuffle for building a fresh paper each time. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
