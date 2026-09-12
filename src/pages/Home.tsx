import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { writtenFor } from '../data/written';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { lessonsForLevel } from '../data/lessons';
import { questionsFor } from '../data/questions';
import { CURRENT_AFFAIRS } from '../data/currentAffairs';
import { REFERENCES } from '../data/references';
import { DAILY_GOAL, currentStreak, goalPercent, questionsToday, recentDays } from '../lib/streak';

export function Home() {
  const { t, b, n } = useLang();
  const { levelId, attempts, subjectStats, savedLessons, savedQuestions } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  if (!level) return null;

  const lessons = lessonsForLevel(level.id);
  const questions = questionsFor(level.id);
  const writtenHere = writtenFor(level.id).length;
  const totalAttempted = Object.values(subjectStats).reduce((sum, s) => sum + s.attempted, 0);
  const totalCorrect = Object.values(subjectStats).reduce((sum, s) => sum + s.correct, 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const focus = CURRENT_AFFAIRS.filter((item) => item.levels.includes(level.id))[0];

  const streak = currentStreak(attempts);
  const today = questionsToday(attempts);
  const week = recentDays(attempts, 7).reverse();

  // Progress per paper: the share of that paper's subjects the candidate has
  // answered anything in. A rough measure, but an honest one — it moves only
  // when a real question has been attempted.
  const papers = level.papers.map((paper) => {
    const subjectIds = [...new Set(paper.sections.flatMap((s) => s.subjectIds))];
    const touched = subjectIds.filter((id) => (subjectStats[id]?.attempted ?? 0) > 0).length;
    return {
      paper,
      subjectCount: subjectIds.length,
      percent: subjectIds.length === 0 ? 0 : Math.round((touched / subjectIds.length) * 100),
    };
  });

  return (
    <div className="stack">
      <div className="hero" style={{ ['--level-accent' as string]: level.accent }}>
        <div className="eyebrow">{t('preparingFor')}</div>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="display" style={{ marginBottom: 4 }}>
              <span aria-hidden="true">{level.icon} </span>
              {b(level.name)}
            </h1>
            <div className="small">{b(level.grade)}</div>
          </div>
        </div>
        <span className="hero-stage">
          {n(level.papers.length)} {t('papers')} · {n(level.papers.reduce((s, p) => s + p.fullMarks, 0))} {t('marks')}
        </span>
      </div>

      <div className="streak">
        <span className="streak-flame" aria-hidden="true">{streak > 0 ? '🔥' : '🕯️'}</span>
        <div>
          <div className="streak-count mono-num">{n(streak)}</div>
          <div className="tiny muted">{t('dayStreak')}</div>
        </div>
        <div className="streak-goal">
          <div className="between tiny" style={{ marginBottom: 5 }}>
            <span>{t('todaysGoal')}</span>
            <span className="mono-num">{n(today)}/{n(DAILY_GOAL)}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${goalPercent(today)}%` }} />
          </div>
          <div className="week" style={{ marginTop: 8 }} aria-label={t('lastSevenDays')}>
            {week.map((on, i) => <span key={i} className={on ? 'on' : ''} />)}
          </div>
        </div>
      </div>

      <section>
        <div className="eyebrow">{t('yourPapers')}</div>
        {papers.map(({ paper, subjectCount, percent }) => (
          <Link key={paper.id} to={`/paper/${paper.id}`} className="paper-row">
            <div className="between" style={{ alignItems: 'flex-start', gap: 10 }}>
              <span className="paper-name">{b(paper.name)}</span>
              <span className="pill">{n(paper.fullMarks)} {t('marks')}</span>
            </div>
            <div className="between tiny muted" style={{ margin: '8px 0 5px' }}>
              <span>{t('subjects')} · {n(subjectCount)}</span>
              <span className="mono-num">{n(percent)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </Link>
        ))}
      </section>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value">{n(totalAttempted)}</div>
          <div className="stat-label">{t('questionsAttempted')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(accuracy)}%</div>
          <div className="stat-label">{t('overallAccuracy')}</div>
        </div>
      </div>

      <section>
        <div className="eyebrow">{t('quickActions')}</div>
        <div className="action-grid">
          <Link to="/first-paper" className="action-tile">
            <span className="subject-icon" aria-hidden="true">🎯</span>
            <span>
              <strong>{t('firstPaperTitle')}</strong>
              <div className="tiny muted">{t('pickATopic')}</div>
            </span>
          </Link>
          <Link to="/study" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📚</span>
            <span>
              <strong>{t('studyNotes')}</strong>
              <div className="tiny muted">{n(lessons.length)} {t('lessons')}</div>
            </span>
          </Link>
          <Link to="/practice" className="action-tile">
            <span className="subject-icon" aria-hidden="true">✍️</span>
            <span>
              <strong>{t('practiceQuiz')}</strong>
              <div className="tiny muted">{n(questions.length)} {t('questions')}</div>
            </span>
          </Link>
          <Link to="/written" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📝</span>
            <span>
              <strong>{t('writtenTitle')}</strong>
              <div className="tiny muted">{n(writtenHere)} {t('writtenQuestions')}</div>
            </span>
          </Link>
          <Link to="/mock" className="action-tile">
            <span className="subject-icon" aria-hidden="true">⏱️</span>
            <span>
              <strong>{t('fullMockTest')}</strong>
              <div className="tiny muted">{n(level.mock.questionCount)} {t('questions')} · {n(level.mock.durationMinutes)} {t('minutes')}</div>
            </span>
          </Link>
          <Link to="/syllabus" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📜</span>
            <span>
              <strong>{t('examPattern')}</strong>
              <div className="tiny muted">{n(level.papers.length)} {t('papers')}</div>
            </span>
          </Link>
          <Link to="/affairs" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📰</span>
            <span>
              <strong>{t('navAffairs')}</strong>
              <div className="tiny muted">{n(CURRENT_AFFAIRS.filter((c) => c.levels.includes(level.id)).length)} {t('topicsCovered')}</div>
            </span>
          </Link>
          <Link to="/materials" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📄</span>
            <span>
              <strong>{t('navMaterials')}</strong>
              <div className="tiny muted">{t('materialsTagline')}</div>
            </span>
          </Link>
          <Link to="/references" className="action-tile">
            <span className="subject-icon" aria-hidden="true">🏛️</span>
            <span>
              <strong>{t('primarySources')}</strong>
              <div className="tiny muted">{n(REFERENCES.filter((r) => r.levels.includes(level.id)).length)} {t('documents')}</div>
            </span>
          </Link>
          <Link to="/saved" className="action-tile">
            <span className="subject-icon" aria-hidden="true">⭐</span>
            <span>
              <strong>{t('navSaved')}</strong>
              <div className="tiny muted">{n(savedLessons.length + savedQuestions.length)} {t('savedItems')}</div>
            </span>
          </Link>
          <Link to="/progress" className="action-tile">
            <span className="subject-icon" aria-hidden="true">📊</span>
            <span>
              <strong>{t('navProgress')}</strong>
              <div className="tiny muted">{n(attempts.length)} {t('totalAttempts')}</div>
            </span>
          </Link>
          <Link to="/about" className="action-tile">
            <span className="subject-icon" aria-hidden="true">ℹ️</span>
            <span>
              <strong>{t('aboutTitle')}</strong>
              <div className="tiny muted">{t('yourMedium')}</div>
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
