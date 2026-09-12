import type { LevelId, WrittenQuestion } from '../../types';
import { OFFICER_PAPER_2 } from './officerPaper2';
import { OFFICER_PAPER_3 } from './officerPaper3';
import { OFFICER_PAPER_4 } from './officerPaper4';
import { NAYAB_SUBBA_WRITTEN } from './nayabSubba';
import { KHARIDAR_WRITTEN } from './kharidar';

/**
 * Long-answer practice for the written papers.
 *
 * Papers II to IV at every level are answered in prose, so multiple choice is
 * the wrong exercise for them: it never asks a candidate to structure an
 * argument, cite an Act, or write to the length the marks allow. These
 * questions carry a model answer instead of an option key.
 */
export const WRITTEN_QUESTIONS: WrittenQuestion[] = [
  ...OFFICER_PAPER_2,
  ...OFFICER_PAPER_3,
  ...OFFICER_PAPER_4,
  ...NAYAB_SUBBA_WRITTEN,
  ...KHARIDAR_WRITTEN,
];

export function writtenFor(levelId: LevelId, paperId?: string | null): WrittenQuestion[] {
  return WRITTEN_QUESTIONS.filter(
    (q) => q.levels.includes(levelId) && (!paperId || q.paperId === paperId),
  );
}

export const WRITTEN_BY_ID: Record<string, WrittenQuestion> = Object.fromEntries(
  WRITTEN_QUESTIONS.map((q) => [q.id, q]),
);
