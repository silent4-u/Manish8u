import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LevelId, MockPattern, Question } from '../types';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { SUBJECT_BY_ID } from '../data/subjects';
import { formatClock, scoreAttempt, type AttemptSummary } from '../lib/scoring';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'];

interface QuizRunnerProps {
  questions: Question[];
  mode: 'practice' | 'mock';
  levelId: LevelId;
  subjectId: string | null;
  /** Required for mock mode: timing and marking rules. */
  mock?: MockPattern;
  onExit: () => void;
}

export function QuizRunner({ questions, mode, levelId, subjectId, mock, onExit }: QuizRunnerProps) {
  const { t, b, n } = useLang();
  const { addAttempt, recordAnswers, savedQuestions, toggleSavedQuestion } = useProgress();

  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => (mock ? mock.durationMinutes * 60 : 0));

  const startedAt = useRef(Date.now());
  const recorded = useRef(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const summary = useMemo(
    () =>
      scoreAttempt(answers, questions, {
        marksPerQuestion: mock?.marksPerQuestion ?? 1,
        negativePerWrong: mock?.negativePerWrong ?? 0,
      }),
    [answers, questions, mock],
  );

  const finish = useCallback(() => {
    if (recorded.current) return;
    recorded.current = true;
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    addAttempt({
      levelId,
      mode,
      subjectId,
      total: questions.length,
      correct: summary.correct,
      wrong: summary.wrong,
      skipped: summary.skipped,
      score: summary.score,
      maxScore: summary.maxScore,
      seconds,
    });
    recordAnswers(
      answers
        .map((answer, i) => ({ subjectId: questions[i].subjectId, isCorrect: answer === questions[i].answer, answered: answer !== null }))
        .filter((r) => r.answered)
        .map(({ subjectId: s, isCorrect }) => ({ subjectId: s, isCorrect })),
    );
    setFinished(true);
  }, [addAttempt, answers, levelId, mode, questions, recordAnswers, subjectId, summary]);

  // Mock mode countdown. Practice mode has no timer.
  useEffect(() => {
    if (mode !== 'mock' || finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, finished]);

  useEffect(() => {
    if (mode === 'mock' && secondsLeft === 0 && !finished) finish();
  }, [mode, secondsLeft, finished, finish]);

  const choose = (optionIndex: number) => {
    if (mode === 'practice' && revealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
    if (mode === 'practice') setRevealed(true);
  };

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setRevealed(false);
  };

  if (finished) {
    return (
      <ResultView
        questions={questions}
        answers={answers}
        summary={summary}
        seconds={Math.round((Date.now() - startedAt.current) / 1000)}
        passPercent={mock?.passPercent ?? 40}
        onExit={onExit}
      />
    );
  }

  const answeredCount = answers.filter((a) => a !== null).length;
  const subject = SUBJECT_BY_ID[current.subjectId];
  const isSaved = savedQuestions.includes(current.id);

  return (
    <div className="stack">
      <div className="quiz-head">
        <div>
          <div className="eyebrow">
            {t('question')} {n(index + 1)} {t('of')} {n(questions.length)}
          </div>
          <div className="small muted">{subject ? b(subject.short) : ''}</div>
        </div>
        {mode === 'mock' ? (
          <div className={`timer${secondsLeft <= 60 ? ' urgent' : ''}`}>
            <span className="tiny muted" style={{ display: 'block', fontWeight: 400 }}>{t('timeLeft')}</span>
            {n(formatClock(secondsLeft))}
          </div>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onExit}>
            {t('finish')}
          </button>
        )}
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="card">
        <div className="between" style={{ alignItems: 'flex-start', marginBottom: 12 }}>
          <h2 style={{ marginBottom: 0, fontSize: '1.08rem' }}>{b(current.prompt)}</h2>
          <button
            type="button"
            className={`bookmark-btn${isSaved ? ' on' : ''}`}
            onClick={() => toggleSavedQuestion(current.id)}
            aria-pressed={isSaved}
          >
            {isSaved ? '★' : '☆'}
          </button>
        </div>

        {current.options.map((option, i) => {
          const chosen = answers[index] === i;
          let className = 'option';
          if (mode === 'practice' && revealed) {
            if (i === current.answer) className += ' is-correct';
            else if (chosen) className += ' is-wrong';
          } else if (chosen) {
            className += ' chosen';
          }
          return (
            <button
              key={i}
              type="button"
              className={className}
              onClick={() => choose(i)}
              disabled={mode === 'practice' && revealed}
            >
              <span className="option-key" aria-hidden="true">{OPTION_KEYS[i]}</span>
              <span>{b(option)}</span>
            </button>
          );
        })}

        {mode === 'practice' && revealed && (
          <div className="notice tone-tip" style={{ marginTop: 12 }}>
            <div>
              <strong className="small">{t('explanation')}</strong>
              <div className="small">{b(current.explanation)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="between">
        <button type="button" className="btn btn-sm" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
          ← {t('previous')}
        </button>

        {mode === 'practice' && !revealed && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => (isLast ? finish() : goTo(index + 1))}>
            {t('skipQuestion')}
          </button>
        )}

        {isLast ? (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (mode === 'mock' && !window.confirm(t('confirmSubmit'))) return;
              finish();
            }}
          >
            {mode === 'mock' ? t('submitTest') : t('finish')}
          </button>
        ) : (
          <button type="button" className="btn btn-sm btn-primary" onClick={() => goTo(index + 1)}>
            {t('next')} →
          </button>
        )}
      </div>

      {mode === 'mock' && (
        <div className="card">
          <div className="between" style={{ marginBottom: 10 }}>
            <span className="eyebrow" style={{ marginBottom: 0 }}>
              {n(answeredCount)} / {n(questions.length)}
            </span>
            <button type="button" className="btn btn-sm" onClick={() => { if (window.confirm(t('confirmSubmit'))) finish(); }}>
              {t('submitTest')}
            </button>
          </div>
          <div className="q-dots">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                className={`q-dot${answers[i] !== null ? ' answered' : ''}${i === index ? ' current' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`${t('question')} ${i + 1}`}
              >
                {n(i + 1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ResultViewProps {
  questions: Question[];
  answers: (number | null)[];
  summary: AttemptSummary;
  seconds: number;
  passPercent: number;
  onExit: () => void;
}

function ResultView({ questions, answers, summary, seconds, passPercent, onExit }: ResultViewProps) {
  const { t, b, n } = useLang();
  const { savedQuestions, toggleSavedQuestion } = useProgress();
  const [showReview, setShowReview] = useState(false);

  const { percent, accuracy } = summary;
  const isPass = percent >= passPercent;

  return (
    <div className="stack">
      <div className="card center">
        <div className="eyebrow">{t('result')}</div>
        <div className="score-ring" style={{ ['--pct' as string]: String(percent) }}>
          <div>
            <strong>{n(percent)}%</strong>
            <div className="tiny muted">
              {n(summary.score)} / {n(summary.maxScore)}
            </div>
          </div>
        </div>
        <span className={`pill ${isPass ? 'pill-ok' : 'pill-err'}`}>{isPass ? t('passed') : t('failed')}</span>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--ok)' }}>{n(summary.correct)}</div>
          <div className="stat-label">{t('correct')}</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: 'var(--err)' }}>{n(summary.wrong)}</div>
          <div className="stat-label">{t('wrong')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(summary.skipped)}</div>
          <div className="stat-label">{t('skipped')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(accuracy)}%</div>
          <div className="stat-label">{t('accuracy')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(formatClock(seconds))}</div>
          <div className="stat-label">{t('timeTaken')}</div>
        </div>
      </div>

      <div className="row">
        <button type="button" className="btn" onClick={() => setShowReview((v) => !v)}>
          {t('reviewAnswers')}
        </button>
        <button type="button" className="btn btn-primary" onClick={onExit}>
          {t('backToHome')}
        </button>
      </div>

      {showReview && (
        <div className="stack">
          {questions.map((question, i) => {
            const given = answers[i];
            const isCorrect = given === question.answer;
            const isSaved = savedQuestions.includes(question.id);
            return (
              <div className="card" key={question.id}>
                <div className="between" style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span className={`pill ${given === null ? '' : isCorrect ? 'pill-ok' : 'pill-err'}`}>
                      {n(i + 1)} · {given === null ? t('skipped') : isCorrect ? t('correct') : t('wrong')}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`bookmark-btn${isSaved ? ' on' : ''}`}
                    onClick={() => toggleSavedQuestion(question.id)}
                    aria-pressed={isSaved}
                  >
                    {isSaved ? '★' : '☆'}
                  </button>
                </div>
                <p style={{ fontWeight: 600 }}>{b(question.prompt)}</p>
                {given !== null && !isCorrect && (
                  <p className="small">
                    <span className="muted">{t('yourAnswer')}: </span>
                    {b(question.options[given])}
                  </p>
                )}
                <p className="small">
                  <span className="muted">{t('correctAnswer')}: </span>
                  <strong>{b(question.options[question.answer])}</strong>
                </p>
                <div className="notice tone-tip">
                  <div className="small">{b(question.explanation)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
