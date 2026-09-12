import type { ExamLevel, Paper, SyllabusSection, WrittenQuestion } from '../types';

/**
 * Arranging long-answer practice by the paper it is written for.
 *
 * Multiple choice practice can be organised by subject, because a subject is
 * how a candidate thinks about revision. A written paper cannot: the marks,
 * the minutes and the expected shape of an answer all come from the paper,
 * and the same subject is examined differently in Paper II than in Paper IV.
 * So these group by paper and section instead.
 */

export interface WrittenSectionGroup {
  section: SyllabusSection;
  questions: WrittenQuestion[];
}

export interface WrittenPaperGroup {
  paper: Paper;
  questions: WrittenQuestion[];
  sections: WrittenSectionGroup[];
  /** Written for the paper but not for a section it still has. */
  general: WrittenQuestion[];
  /** Marks covered by the questions, against the paper's full marks. */
  marksCovered: number;
}

/** Papers answered in prose. The objective papers are practised as quizzes. */
export function writtenPapers(level: ExamLevel): Paper[] {
  return level.papers.filter((paper) => paper.format !== 'objective');
}

/** Lowest question id first, so the order never depends on file order. */
function ordered(questions: WrittenQuestion[]): WrittenQuestion[] {
  return [...questions].sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * One group per written paper of a level. A question whose section has been
 * renumbered by a syllabus revision falls back to the paper's general list
 * rather than disappearing, which is what happens to content written against
 * an earlier edition of the paper.
 */
export function writtenGroups(level: ExamLevel, questions: WrittenQuestion[]): WrittenPaperGroup[] {
  const mine = questions.filter((q) => q.levels.includes(level.id));
  return writtenPapers(level).map((paper) => {
    const forPaper = ordered(mine.filter((q) => q.paperId === paper.id));
    const known = new Set(paper.sections.map((s) => s.id));
    return {
      paper,
      questions: forPaper,
      sections: paper.sections.map((section) => ({
        section,
        questions: forPaper.filter((q) => q.sectionId === section.id),
      })),
      general: forPaper.filter((q) => !known.has(q.sectionId)),
      marksCovered: forPaper.reduce((sum, q) => sum + q.marks, 0),
    };
  });
}

/**
 * How much of a paper the practice set covers, as a percentage of its full
 * marks. A candidate should be able to see that a paper is half stocked
 * rather than guess at it from a question count.
 */
export function writtenCoverage(group: WrittenPaperGroup): number {
  if (group.paper.fullMarks <= 0) return 0;
  return Math.min(100, Math.round((group.marksCovered / group.paper.fullMarks) * 100));
}

/** Words a candidate should be aiming at, from the marks the question carries. */
export function targetWords(marks: number): { min: number; max: number } {
  // The commission's own pattern runs at roughly thirty words a mark for a
  // full answer; below twenty a mark an answer reads as a note, and much
  // above forty the time runs out before the paper does.
  return { min: marks * 25, max: marks * 35 };
}
