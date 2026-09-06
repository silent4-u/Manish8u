import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { lessonsForLevel } from '../data/lessons';
import { questionsFor } from '../data/questions';
import { CURRENT_AFFAIRS } from '../data/currentAffairs';

export function Home() {
  const { t, b, n } = useLang();
  const { levelId, attempts, subjectStats, savedLessons, savedQuestions } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  if (!level) return null;

  const lessons = lessonsForLevel(level.id);
  const questions = questionsFor(level.id);
  const totalAttempted = Object.values(subjectStats).reduce((sum, s) => sum + s.attempted, 0);
  const totalCorrect = Object.values(subjectStats).reduce((sum, s) => sum + s.correct, 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const focus = CURRENT_AFFAIRS.filter((item) => item.levels.includes(level.id))[0];

  return (
    <div className="stack">
      <div className="card" style={{ ['--level-accent' as string]: level.accent }}>
        <div className="eyebrow">{t('preparingFor')}</div>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="display" style={{ marginBottom: 4 }}>
              <span aria-hidden="true">{level.icon} </span>
              {b(level.name)}
            </h1>
            <div className="small muted">{b(level.grade)}</div>
          </div>
          <Link to="/levels" className="btn btn-sm btn-ghost">{t('changeLevel')}</Link>
        </div>
        <p className="small" style={{ marginTop: 10, marginBottom: 0 }}>{b(level.summary)}</p>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value">{n(lessons.length)}</div>
          <div className="stat-label">{t('lessons')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(questions.length)}</div>
          <div className="stat-label">{t('questions')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(attempts.length)}</div>
          <div className="stat-label">{t('totalAttempts')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(accuracy)}%</div>
          <div className="stat-label">{t('overallAccuracy')}</div>
        </div>
      </div>

      <section>
        <div className="eyebrow">{t('quickActions')}</div>
        <div className="grid grid-2">
          <Link to="/first-paper" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">🎯</span>
            <span>
              <strong>{t('firstPaperTitle')}</strong>
              <div className="small muted">{t('pickATopic')}</div>
            </span>
          </Link>
          <Link to="/study" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">📚</span>
            <span>
              <strong>{t('studyNotes')}</strong>
              <div className="small muted">{n(lessons.length)} {t('lessons')}</div>
            </span>
          </Link>
          <Link to="/practice" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">✍️</span>
            <span>
              <strong>{t('practiceQuiz')}</strong>
              <div className="small muted">{n(questions.length)} {t('questions')}</div>
            </span>
          </Link>
          <Link to="/mock" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">⏱️</span>
            <span>
              <strong>{t('fullMockTest')}</strong>
              <div className="small muted">
                {n(level.mock.questionCount)} {t('questions')} · {n(level.mock.durationMinutes)} {t('minutes')}
              </div>
            </span>
          </Link>
          <Link to="/syllabus" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">📜</span>
            <span>
              <strong>{t('examPattern')}</strong>
              <div className="small muted">
                {n(level.papers.length)} {t('papers')} · {n(level.papers.reduce((s, p) => s + p.fullMarks, 0))} {t('marks')}
              </div>
            </span>
          </Link>
          <Link to="/affairs" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">📰</span>
            <span>
              <strong>{t('navAffairs')}</strong>
              <div className="small muted">{n(CURRENT_AFFAIRS.filter((c) => c.levels.includes(level.id)).length)} {t('topicsCovered')}</div>
            </span>
          </Link>
          <Link to="/saved" className="subject-tile">
            <span className="subject-icon" aria-hidden="true">⭐</span>
            <span>
              <strong>{t('navSaved')}</strong>
              <div className="small muted">{n(savedLessons.length + savedQuestions.length)} {t('savedItems')}</div>
            </span>
          </Link>
        </div>
      </section>

      {focus && (
        <section>
          <div className="eyebrow">{t('todaysFocus')}</div>
          <Link to="/affairs" className="card" style={{ display: 'block', color: 'inherit' }}>
            <span className="pill pill-accent">{b(focus.category)}</span>
            <h3 style={{ marginTop: 8 }}>{b(focus.title)}</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>{b(focus.detail)}</p>
          </Link>
        </section>
      )}
    </div>
  );
}
