import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { SUBJECTS, SUBJECT_BY_ID } from '../data/subjects';
import { questionsBySubject, questionsFor, shuffle } from '../data/questions';
import { QuizRunner } from '../components/QuizRunner';
import { Empty } from '../components/Empty';

const PRACTICE_SIZE = 10;

export function PracticePicker() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  if (!levelId) return null;

  const subjects = SUBJECTS.filter((s) => s.levels.includes(levelId));
  const total = questionsFor(levelId).length;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('navPractice')}</div>
        <h1 className="display">{t('selectSubject')}</h1>
      </div>

      <Link to="/practice/all" className="card" style={{ display: 'block', color: 'inherit' }}>
        <div className="between">
          <div>
            <strong>🎲 {t('mixedPractice')}</strong>
            <div className="small muted">{n(total)} {t('questions')}</div>
          </div>
          <span className="btn btn-sm btn-primary">{t('start')}</span>
        </div>
      </Link>

      <div className="grid grid-2">
        {subjects.map((subject) => {
          const count = questionsFor(levelId, subject.id).length;
          if (count === 0) return null;
          return (
            <Link key={subject.id} to={`/practice/${subject.id}`} className="subject-tile">
              <span className="subject-icon" aria-hidden="true">{subject.icon}</span>
              <span>
                <strong>{b(subject.name)}</strong>
                <div className="small muted">{n(count)} {t('questions')}</div>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PracticeQuiz() {
  const { subjectId = 'all' } = useParams();
  const { t, b } = useLang();
  const { levelId } = useProgress();
  const navigate = useNavigate();
  const [round, setRound] = useState(0);

  const subject = subjectId === 'all' ? null : SUBJECT_BY_ID[subjectId];

  const questions = useMemo(() => {
    if (!levelId) return [];
    const pool = questionsFor(levelId, subjectId === 'all' ? null : subjectId);
    return shuffle(pool).slice(0, PRACTICE_SIZE);
    // `round` forces a fresh shuffle when the learner restarts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, subjectId, round]);

  if (!levelId) return null;

  if (questions.length === 0) {
    return (
      <div className="stack">
        <Empty icon="📭">{t('noQuestions')}</Empty>
        <button type="button" className="btn" onClick={() => navigate('/practice')}>{t('back')}</button>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="breadcrumb">
        <Link to="/practice">{t('navPractice')}</Link> / {subject ? b(subject.short) : t('mixedPractice')}
      </div>
      <QuizRunner
        key={`${subjectId}-${round}`}
        questions={questions}
        mode="practice"
        levelId={levelId}
        subjectId={subjectId === 'all' ? null : subjectId}
        onExit={() => setRound((r) => r + 1)}
      />
    </div>
  );
}

/**
 * Practice drawn from every post's questions on one subject, entered from the
 * first paper hub. The attempt is still recorded against the learner's own
 * level so their progress stays coherent.
 */
export function FirstPaperQuiz() {
  const { subjectId = '' } = useParams();
  const { t, b } = useLang();
  const { levelId } = useProgress();
  const navigate = useNavigate();
  const [round, setRound] = useState(0);

  const subject = SUBJECT_BY_ID[subjectId];

  const questions = useMemo(
    () => shuffle(questionsBySubject(subjectId)).slice(0, PRACTICE_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjectId, round],
  );

  if (!levelId) return null;

  if (questions.length === 0) {
    return (
      <div className="stack">
        <Empty icon="📭">{t('noQuestions')}</Empty>
        <button type="button" className="btn" onClick={() => navigate('/first-paper')}>
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="breadcrumb">
        <Link to="/first-paper">{t('firstPaperTitle')}</Link> / {subject ? b(subject.short) : subjectId}
      </div>
      <QuizRunner
        key={`fp-${subjectId}-${round}`}
        questions={questions}
        mode="practice"
        levelId={levelId}
        subjectId={subjectId}
        onExit={() => setRound((r) => r + 1)}
      />
    </div>
  );
}
