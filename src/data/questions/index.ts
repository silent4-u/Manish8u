import type { Question } from '../../types';
import { constitutionQuestions } from './constitution';
import { gkNepalQuestions } from './gkNepal';
import { governanceQuestions } from './governance';
import { officeEconomyQuestions } from './officeEconomy';
import { worldIctQuestions } from './worldIct';
import { iqQuestions } from './iq';
import { languageQuestions } from './language';
import { currentAffairsQuestions } from './currentAffairs';

export const QUESTIONS: Question[] = [
  ...constitutionQuestions,
  ...gkNepalQuestions,
  ...governanceQuestions,
  ...officeEconomyQuestions,
  ...worldIctQuestions,
  ...iqQuestions,
  ...languageQuestions,
  ...currentAffairsQuestions,
];

export function questionsFor(levelId: string, subjectId?: string | null): Question[] {
  return QUESTIONS.filter(
    (q) =>
      q.levels.includes(levelId as Question['levels'][number]) &&
      (!subjectId || q.subjectId === subjectId),
  );
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
