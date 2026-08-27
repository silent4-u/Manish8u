import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AttemptRecord, LevelId, SubjectStat } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface ProgressValue {
  levelId: LevelId | null;
  setLevelId: (id: LevelId) => void;
  attempts: AttemptRecord[];
  addAttempt: (attempt: Omit<AttemptRecord, 'id' | 'finishedAt'>) => void;
  subjectStats: Record<string, SubjectStat>;
  recordAnswers: (results: { subjectId: string; isCorrect: boolean }[]) => void;
  savedQuestions: string[];
  savedLessons: string[];
  toggleSavedQuestion: (id: string) => void;
  toggleSavedLesson: (id: string) => void;
  clearAll: () => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [levelId, setLevel] = useLocalStorage<LevelId | null>('lss.level', null);
  const [attempts, setAttempts] = useLocalStorage<AttemptRecord[]>('lss.attempts', []);
  const [subjectStats, setSubjectStats] = useLocalStorage<Record<string, SubjectStat>>('lss.subjectStats', {});
  const [savedQuestions, setSavedQuestions] = useLocalStorage<string[]>('lss.savedQuestions', []);
  const [savedLessons, setSavedLessons] = useLocalStorage<string[]>('lss.savedLessons', []);

  const setLevelId = useCallback((id: LevelId) => setLevel(id), [setLevel]);

  const addAttempt = useCallback(
    (attempt: Omit<AttemptRecord, 'id' | 'finishedAt'>) => {
      const record: AttemptRecord = {
        ...attempt,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        finishedAt: Date.now(),
      };
      // Keep the 50 most recent attempts so storage stays small.
      setAttempts((prev) => [record, ...prev].slice(0, 50));
    },
    [setAttempts],
  );

  const recordAnswers = useCallback(
    (results: { subjectId: string; isCorrect: boolean }[]) => {
      setSubjectStats((prev) => {
        const next = { ...prev };
        for (const { subjectId, isCorrect } of results) {
          const current = next[subjectId] ?? { attempted: 0, correct: 0 };
          next[subjectId] = {
            attempted: current.attempted + 1,
            correct: current.correct + (isCorrect ? 1 : 0),
          };
        }
        return next;
      });
    },
    [setSubjectStats],
  );

  const toggleSavedQuestion = useCallback(
    (id: string) =>
      setSavedQuestions((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])),
    [setSavedQuestions],
  );

  const toggleSavedLesson = useCallback(
    (id: string) =>
      setSavedLessons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])),
    [setSavedLessons],
  );

  const clearAll = useCallback(() => {
    setAttempts([]);
    setSubjectStats({});
    setSavedQuestions([]);
    setSavedLessons([]);
  }, [setAttempts, setSubjectStats, setSavedQuestions, setSavedLessons]);

  const value = useMemo<ProgressValue>(
    () => ({
      levelId,
      setLevelId,
      attempts,
      addAttempt,
      subjectStats,
      recordAnswers,
      savedQuestions,
      savedLessons,
      toggleSavedQuestion,
      toggleSavedLesson,
      clearAll,
    }),
    [
      levelId, setLevelId, attempts, addAttempt, subjectStats, recordAnswers,
      savedQuestions, savedLessons, toggleSavedQuestion, toggleSavedLesson, clearAll,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside a ProgressProvider');
  return ctx;
}
