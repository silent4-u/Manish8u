import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID, firstPaperSubjects, isCommonToAllPosts } from '../data/levels';
import { SUBJECT_BY_ID } from '../data/subjects';
import { LESSONS } from '../data/lessons';
import { QUESTIONS } from '../data/questions';
export function FirstPaper() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const [mineOnly, setMineOnly] = useState(false);

  const all = firstPaperSubjects();
  const shown = mineOnly && levelId ? all.filter((s) => s.levels.includes(levelId)) : all;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('paper')} I</div>
        <h1 className="display">{t('firstPaperTitle')}</h1>
        <p className="muted small">{t('firstPaperLede')}</p>
      </div>

      <div className="notice tone-tip">
        <div className="small">{t('firstPaperNote')}</div>
      </div>

      <div className="row">
        <button
          type="button"
          className={`btn btn-sm${mineOnly ? '' : ' btn-primary'}`}
          onClick={() => setMineOnly(false)}
        >
          {t('allPosts')}
        </button>
        <button
          type="button"
          className={`btn btn-sm${mineOnly ? ' btn-primary' : ''}`}
          onClick={() => setMineOnly(true)}
          disabled={!levelId}
        >
          {t('onlyMyPaper')}
        </button>
      </div>

      {shown.map((entry) => {
        const subject = SUBJECT_BY_ID[entry.subjectId];
        if (!subject) return null;

        const common = isCommonToAllPosts(entry);
        const onMyPaper = levelId ? entry.levels.includes(levelId) : false;
        // One line per post: which section examines this subject, and for how much.
        const seenSections = new Set<string>();
        const placements = entry.placements.filter((p) => {
          const key = `${p.levelId}:${p.sectionName.en}`;
          return seenSections.has(key) ? false : (seenSections.add(key), true);
        });
        // Counts are across every post, since this hub is not level-filtered.
        const lessonCount = LESSONS.filter((l) => l.subjectId === entry.subjectId).length;
        const questionCount = QUESTIONS.filter((q) => q.subjectId === entry.subjectId).length;

        return (
          <div className="card" key={entry.subjectId}>
            <div className="between" style={{ alignItems: 'flex-start' }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="subject-icon" aria-hidden="true">{subject.icon}</span>
                <div>
                  <h2 style={{ marginBottom: 2, fontSize: '1.05rem' }}>{b(subject.name)}</h2>
                  <div className="tiny muted">
                    {n(entry.totalMarks)} {t('marks')} · {n(lessonCount)} {t('lessons')} · {n(questionCount)} {t('questions')}
                  </div>
                </div>
              </div>
              {onMyPaper && <span className="pill pill-ok">{t('onYourPaper')}</span>}
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {common ? (
                <span className="pill pill-accent">{t('allThreePosts')}</span>
              ) : (
                entry.levels.map((id) => (
                  <span className="pill" key={id}>
                    {LEVEL_BY_ID[id]?.icon} {b(LEVEL_BY_ID[id]?.shortName ?? { en: id, ne: id })}
                  </span>
                ))
              )}
            </div>

            <p className="small" style={{ marginTop: 10, marginBottom: 8 }}>
              {b(subject.description)}
            </p>

            <div className="eyebrow" style={{ marginBottom: 4 }}>{t('examinedUnder')}</div>
            <ul className="small" style={{ marginTop: 0 }}>
              {placements.map((pl, i) => (
                <li key={i}>
                  <strong>{b(LEVEL_BY_ID[pl.levelId]?.shortName ?? { en: pl.levelId, ne: pl.levelId })}</strong>
                  {' — '}
                  {b(pl.sectionName)}
                  {pl.marks !== undefined && ` (${n(pl.marks)} ${t('marks')})`}
                </li>
              ))}
            </ul>

            <div className="row">
              <Link to={`/study/${entry.subjectId}`} className="btn btn-sm">
                {t('navStudy')}
              </Link>
              <Link to={`/first-paper/practice/${entry.subjectId}`} className="btn btn-sm btn-primary">
                {t('practiceThisSubject')}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
