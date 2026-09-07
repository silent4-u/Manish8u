import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { EXAM_MEDIUM_NOTE, LEVEL_BY_ID, SYLLABUS_REVISION_NOTE } from '../data/levels';
import { SUBJECT_BY_ID } from '../data/subjects';

export function Syllabus() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;
  const [openPaper, setOpenPaper] = useState<string | null>(level?.papers[0]?.id ?? null);

  if (!level) return null;

  const formatLabel = { objective: t('objective'), subjective: t('subjective'), mixed: t('mixed') };

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{b(level.name)}</div>
        <h1 className="display">{t('navSyllabus')}</h1>
        <div className="row small muted">
          <span>{b(level.grade)}</span>
        </div>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 4 }}>{t('minQualification')}</div>
        <div className="small">{b(level.minQualification)}</div>
        <hr className="divider" />
        <div className="eyebrow" style={{ marginBottom: 4 }}>{t('examMedium')}</div>
        <div className="small">{b(EXAM_MEDIUM_NOTE[level.id])}</div>
      </div>

      {level.papers.map((paper) => {
        const isOpen = openPaper === paper.id;
        return (
          <div className="card" key={paper.id}>
            <button
              type="button"
              className="between"
              style={{ width: '100%', background: 'none', border: 0, padding: 0, textAlign: 'left' }}
              onClick={() => setOpenPaper(isOpen ? null : paper.id)}
              aria-expanded={isOpen}
            >
              <h2 style={{ marginBottom: 0, fontSize: '1.02rem' }}>{b(paper.name)}</h2>
              <span aria-hidden="true" className="muted">{isOpen ? '−' : '+'}</span>
            </button>

            <div className="row" style={{ marginTop: 10 }}>
              <span className="pill pill-accent">{formatLabel[paper.format]}</span>
              <span className="pill">{n(paper.fullMarks)} {t('marks')}</span>
              <span className="pill">{t('passMarks')} {n(paper.passMarks)}</span>
              <span className="pill">{n(paper.durationMinutes)} {t('minutes')}</span>
            </div>
            <div className="small muted" style={{ marginTop: 8 }}>
              {t('pattern')}: {b(paper.pattern)}
            </div>
            <Link to={`/paper/${paper.id}`} className="btn btn-sm btn-primary" style={{ marginTop: 10 }}>
              {t('studyThisPaper')}
            </Link>

            {isOpen && (
              <>
                <hr className="divider" />
                <div className="stack">
                  {paper.sections.map((section) => (
                    <div key={section.id}>
                      <div className="between" style={{ alignItems: 'flex-start' }}>
                        <h3 style={{ marginBottom: 6 }}>{b(section.name)}</h3>
                        {section.marks !== undefined && (
                          <span className="pill">{n(section.marks)} {t('marks')}</span>
                        )}
                      </div>
                      <ul className="small">
                        {section.topics.map((topic, i) => <li key={i}>{b(topic)}</li>)}
                      </ul>
                      <div className="row">
                        {section.subjectIds.map((id) => {
                          const subject = SUBJECT_BY_ID[id];
                          if (!subject) return null;
                          return (
                            <Link key={id} to={`/study/${id}`} className="btn btn-sm">
                              <span aria-hidden="true">{subject.icon}</span> {b(subject.short)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="notice">
        <div>
          <strong className="small">{t('syllabusNotice')}</strong>
          <div className="small">{b(SYLLABUS_REVISION_NOTE)}</div>
        </div>
      </div>
    </div>
  );
}
