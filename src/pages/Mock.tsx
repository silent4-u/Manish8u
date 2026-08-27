import { useMemo, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { questionsFor, shuffle } from '../data/questions';
import { QuizRunner } from '../components/QuizRunner';
import { Empty } from '../components/Empty';

export function Mock() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);

  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  const questions = useMemo(() => {
    if (!levelId || !level) return [];
    return shuffle(questionsFor(levelId)).slice(0, level.mock.questionCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, level, round]);

  if (!level || !levelId) return null;

  if (running) {
    if (questions.length === 0) return <Empty icon="📭">{t('noQuestions')}</Empty>;
    return (
      <QuizRunner
        key={round}
        questions={questions}
        mode="mock"
        levelId={levelId}
        subjectId={null}
        mock={level.mock}
        onExit={() => {
          setRunning(false);
          setRound((r) => r + 1);
        }}
      />
    );
  }

  const { mock } = level;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{b(level.name)}</div>
        <h1 className="display">{t('fullMockTest')}</h1>
        <p className="muted">{t('mockIntro')}</p>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value">{n(mock.questionCount)}</div>
          <div className="stat-label">{t('questions')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(mock.durationMinutes)}</div>
          <div className="stat-label">{t('minutes')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(mock.questionCount * mock.marksPerQuestion)}</div>
          <div className="stat-label">{t('fullMarks')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(mock.passPercent)}%</div>
          <div className="stat-label">{t('passMarks')}</div>
        </div>
      </div>

      {mock.negativePerWrong > 0 && (
        <div className="notice tone-warn">
          <div className="small">
            <strong>{t('negativeMarking')}: </strong>
            −{n(mock.negativePerWrong)} {t('marks')} {t('perWrongAnswer')}
          </div>
        </div>
      )}

      <button type="button" className="btn btn-primary btn-block" onClick={() => setRunning(true)}>
        {t('start')}
      </button>
    </div>
  );
}
