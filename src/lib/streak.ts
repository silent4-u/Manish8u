import type { AttemptRecord } from '../types';

/**
 * Study rhythm, derived from the attempt history that is already stored. No
 * new state is kept: a streak that cannot be reconstructed from real attempts
 * is a streak the app would be inventing.
 */

/** Local calendar day as YYYY-MM-DD. Local, because the candidate's day is. */
export function dayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** The day `offset` days before `from`, as a key. */
function shiftedKey(from: Date, offset: number): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() - offset);
  return dayKey(d.getTime());
}

/** Every distinct day the candidate attempted something. */
export function activeDays(attempts: AttemptRecord[]): Set<string> {
  return new Set(attempts.map((a) => dayKey(a.finishedAt)));
}

/**
 * Consecutive days of practice ending today, or ending yesterday when today
 * has not started yet. A day is only lost once it has been missed in full,
 * which is what makes the number worth keeping up.
 */
export function currentStreak(attempts: AttemptRecord[], now = new Date()): number {
  const days = activeDays(attempts);
  if (days.size === 0) return 0;

  const startedToday = days.has(shiftedKey(now, 0));
  if (!startedToday && !days.has(shiftedKey(now, 1))) return 0;

  let streak = 0;
  for (let offset = startedToday ? 0 : 1; days.has(shiftedKey(now, offset)); offset += 1) {
    streak += 1;
  }
  return streak;
}

/** Questions attempted today, counting every question on every paper sat. */
export function questionsToday(attempts: AttemptRecord[], now = new Date()): number {
  const today = shiftedKey(now, 0);
  return attempts
    .filter((a) => dayKey(a.finishedAt) === today)
    .reduce((sum, a) => sum + a.total, 0);
}

/** How many of the last `days` days were studied, most recent first. */
export function recentDays(attempts: AttemptRecord[], days: number, now = new Date()): boolean[] {
  const active = activeDays(attempts);
  return Array.from({ length: days }, (_, i) => active.has(shiftedKey(now, i)));
}

/** The default daily target: one practice set. */
export const DAILY_GOAL = 20;

/** Progress towards today's goal, capped at 100. */
export function goalPercent(done: number, goal = DAILY_GOAL): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((done / goal) * 100));
}
