import type { Difficulty, LevelId, Question } from '../../types';

const LEVEL_CODE: Record<string, LevelId> = {
  a: 'adhikrit',
  n: 'nayabsubba',
  k: 'kharidar',
};

/**
 * Compact authoring shape for a question. Keeping it terse keeps the bank
 * readable — `buildQuestions` expands it into the full `Question` type and
 * fails loudly on malformed entries.
 */
export interface QSpec {
  /** Unique id, e.g. "con-q01". */
  id: string;
  /** Subject id from SUBJECTS. */
  s: string;
  /** Level codes: any of "a" (Adhikrit), "n" (Nayab Subba), "k" (Kharidar). */
  lv: string;
  d: Difficulty;
  /** Question text as [english, nepali]. */
  q: [string, string];
  /** Options, each as [english, nepali]. */
  o: [string, string][];
  /** Zero-based index of the correct option. */
  a: number;
  /** Explanation as [english, nepali]. */
  e: [string, string];
}

export function buildQuestions(specs: QSpec[]): Question[] {
  return specs.map((spec) => {
    const levels = [...spec.lv].map((code) => {
      const level = LEVEL_CODE[code];
      if (!level) throw new Error(`${spec.id}: unknown level code "${code}"`);
      return level;
    });
    if (spec.o.length < 2) throw new Error(`${spec.id}: needs at least two options`);
    if (spec.a < 0 || spec.a >= spec.o.length) {
      throw new Error(`${spec.id}: answer index ${spec.a} is out of range`);
    }
    return {
      id: spec.id,
      subjectId: spec.s,
      levels,
      difficulty: spec.d,
      prompt: { en: spec.q[0], ne: spec.q[1] },
      options: spec.o.map(([en, ne]) => ({ en, ne })),
      answer: spec.a,
      explanation: { en: spec.e[0], ne: spec.e[1] },
    };
  });
}
