import type { Lesson } from '../../types';
import { constitutionLessons } from './constitution';
import { gkNepalLessons } from './gkNepal';
import { governanceLessons } from './governance';
import { officeMgmtLessons } from './officeMgmt';
import { economyLessons } from './economy';
import { worldIctLessons } from './worldIct';
import { skillLessons } from './skills';
import { bostLessons } from './bost';
import { mathsLessons } from './maths';

export const LESSONS: Lesson[] = [
  ...constitutionLessons,
  ...gkNepalLessons,
  ...governanceLessons,
  ...officeMgmtLessons,
  ...economyLessons,
  ...worldIctLessons,
  ...skillLessons,
  ...bostLessons,
  ...mathsLessons,
];

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l]),
);

export function lessonsForLevel(levelId: string): Lesson[] {
  return LESSONS.filter((l) => l.levels.includes(levelId as Lesson['levels'][number]));
}
