/** Two-letter language codes supported across the whole app. */
export type Lang = 'en' | 'ne';

/** Every user-visible string in the content layer carries both languages. */
export interface Bilingual {
  en: string;
  ne: string;
}

export type LevelId = 'adhikrit' | 'nayabsubba' | 'kharidar';

export type PaperFormat = 'objective' | 'subjective' | 'mixed';

export interface SyllabusSection {
  id: string;
  name: Bilingual;
  marks?: number;
  /** Subject ids whose study notes / questions cover this section. */
  subjectIds: string[];
  topics: Bilingual[];
}

export interface Paper {
  id: string;
  name: Bilingual;
  fullMarks: number;
  passMarks: number;
  durationMinutes: number;
  format: PaperFormat;
  /** Human readable question pattern, e.g. "50 x 2 marks". */
  pattern: Bilingual;
  sections: SyllabusSection[];
}

export interface MockPattern {
  questionCount: number;
  durationMinutes: number;
  marksPerQuestion: number;
  /** Marks deducted per wrong answer (0 when there is no negative marking). */
  negativePerWrong: number;
  passPercent: number;
}

export interface ExamLevel {
  id: LevelId;
  name: Bilingual;
  /** Short label used on chips and badges. */
  shortName: Bilingual;
  /** Service grade, e.g. Gazetted Third Class. */
  grade: Bilingual;
  summary: Bilingual;
  accent: string;
  icon: string;
  minQualification: Bilingual;
  papers: Paper[];
  mock: MockPattern;
}

export interface Subject {
  id: string;
  name: Bilingual;
  short: Bilingual;
  icon: string;
  description: Bilingual;
  levels: LevelId[];
}

export type LessonBlock =
  | { type: 'heading'; text: Bilingual }
  | { type: 'para'; text: Bilingual }
  | { type: 'list'; items: Bilingual[]; ordered?: boolean }
  | { type: 'facts'; items: { label: Bilingual; value: Bilingual }[] }
  | { type: 'table'; headers: Bilingual[]; rows: Bilingual[][] }
  | { type: 'callout'; tone: 'key' | 'tip' | 'warn'; text: Bilingual };

export interface Lesson {
  id: string;
  subjectId: string;
  levels: LevelId[];
  /**
   * Syllabus section ids this lesson was written for, when it was written
   * against a particular paper rather than a subject in general. The paper
   * view leads with these; everything else on the subject follows.
   */
  sections?: string[];
  title: Bilingual;
  summary: Bilingual;
  readMinutes: number;
  blocks: LessonBlock[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subjectId: string;
  levels: LevelId[];
  difficulty: Difficulty;
  prompt: Bilingual;
  options: Bilingual[];
  /** Index into `options`. */
  answer: number;
  explanation: Bilingual;
}

/**
 * How far a current-affairs entry has been checked. Entries gathered from
 * news search are `unverified` until someone confirms them against an
 * official source, and the app marks them as such so a candidate is never
 * shown an unchecked claim as settled fact.
 */
export type AffairStatus = 'verified' | 'unverified';

export interface CurrentAffair {
  id: string;
  /** ISO date of the event or of the note. */
  date: string;
  /** Calendar month the entry files under, as YYYY-MM. */
  month: string;
  category: Bilingual;
  title: Bilingual;
  detail: Bilingual;
  levels: LevelId[];
  status: AffairStatus;
  /** Where the claim came from. Required for anything not yet verified. */
  sources?: string[];
  /** What specifically still needs confirming, when status is unverified. */
  checkNote?: Bilingual;
}

/** One finished quiz or mock test, kept in local storage. */
export interface AttemptRecord {
  id: string;
  levelId: LevelId;
  mode: 'practice' | 'mock';
  subjectId: string | null;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  /** Seconds spent on the attempt. */
  seconds: number;
  finishedAt: number;
}

export interface SubjectStat {
  attempted: number;
  correct: number;
}
