import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { LESSONS } from '../data/lessons';
import { SUBJECT_BY_ID } from '../data/subjects';
import { Empty } from '../components/Empty';

/**
 * One paper, studied as a paper. The syllabus screen lists what is examined;
 * this screen answers the next question — what to read for it. Notes written
 * against a particular section lead, and the rest of the notes on the same
 * subjects follow, so a candidate revising a single paper is not left to
 * assemble it from the subject list themselves.
 */
export function Paper() {
  const { paperId } = useParams<{ paperId: string }>();
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const [variantId, setVariantId] = useState<string | null>(null);
  const level = levelId ? LEVEL_BY_ID[levelId] : null;
  const paper = level?.papers.find((p) => p.id === paperId) ?? null;

  if (!level || !paper) {
    return (
      <div className="stack">
        <Empty icon="📜">{t('noResults')}</Empty>
        <Link to="/syllabus" className="btn">{t('navSyllabus')}</Link>
      </div>
    );
  }

  const forLevel = LESSONS.filter((l) => l.levels.includes(level.id));
  const formatLabel = { objective: t('objective'), subjective: t('subjective'), mixed: t('mixed') };

  // A service related paper is set once per service group, so the same paper
  // slot can carry several syllabi. The version the paper itself holds is the
  // one most candidates sit; the rest are offered beside it.
  const variants = paper.variants ?? [];
  const selected = variants.find((v) => v.id === variantId) ?? null;
  const sections = selected ? selected.sections : paper.sections;
  const appliesTo = selected ? selected.appliesTo : paper.appliesTo;

  return (
    <div className="stack">
      <div>
        <div className="breadcrumb">
          <Link to="/syllabus">{t('navSyllabus')}</Link> / {b(level.shortName)}
        </div>
        <h1 className="display" style={{ marginBottom: 6 }}>{b(paper.name)}</h1>
        <div className="row">
          <span className="pill pill-accent">{formatLabel[paper.format]}</span>
          <span className="pill">{n(paper.fullMarks)} {t('marks')}</span>
          <span className="pill">{t('passMarks')} {n(paper.passMarks)}</span>
          <span className="pill">{n(paper.durationMinutes)} {t('minutes')}</span>
        </div>
        <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>{b(paper.pattern)}</p>
      </div>

      {variants.length > 0 && (
        <div className="card">
          <div className="eyebrow">{t('whichVersion')}</div>
          <div className="row" style={{ marginTop: 6 }}>
            <button
              type="button"
              className={`btn btn-sm${selected === null ? ' btn-primary' : ''}`}
              aria-pressed={selected === null}
              onClick={() => setVariantId(null)}
            >
              {paper.appliesTo ? b(paper.appliesTo) : t('all')}
            </button>
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`btn btn-sm${selected?.id === variant.id ? ' btn-primary' : ''}`}
                aria-pressed={selected?.id === variant.id}
                onClick={() => setVariantId(variant.id)}
              >
                {b(variant.appliesTo)}
              </button>
            ))}
          </div>
          {appliesTo && (
            <div className="tiny muted" style={{ marginTop: 8 }}>
              {t('showingSyllabusFor')}: {b(appliesTo)}
            </div>
          )}
        </div>
      )}

      {paper.format === 'objective' && (
        <Link to="/mock" className="btn btn-primary btn-block">
          {t('fullMockTest')} · {n(level.mock.questionCount)} {t('questions')}
        </Link>
      )}

      {sections.map((section) => {
        const written = forLevel.filter((l) => l.sections?.includes(section.id));
        const writtenIds = new Set(written.map((l) => l.id));
        const related = forLevel.filter(
          (l) => !writtenIds.has(l.id) && section.subjectIds.includes(l.subjectId),
        );

        return (
          <section key={section.id} className="card">
            <div className="between" style={{ alignItems: 'flex-start', gap: 10 }}>
              <h2 style={{ marginBottom: 0, fontSize: '1.02rem' }}>{b(section.name)}</h2>
              {section.marks !== undefined && (
                <span className="pill">{n(section.marks)} {t('marks')}</span>
              )}
            </div>

            {written.length > 0 && (
              <>
                <div className="eyebrow" style={{ marginTop: 12 }}>{t('writtenForThisSection')}</div>
                <div className="stack">
                  {written.map((lesson) => (
                    <Link key={lesson.id} to={`/lesson/${lesson.id}`} className="subject-tile">
                      <span className="subject-icon" aria-hidden="true">📖</span>
                      <span>
                        <strong>{b(lesson.title)}</strong>
                        <div className="small muted">{b(lesson.summary)}</div>
                        <div className="tiny muted" style={{ marginTop: 4 }}>
                          {n(lesson.readMinutes)} {t('minutes')} {t('readTime')}
                        </div>
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {related.length > 0 && (
              <>
                <div className="eyebrow" style={{ marginTop: 14 }}>{t('alsoOnTheseSubjects')}</div>
                {written.length === 0 && (
                  <div className="tiny muted">{t('noNotesWrittenForSection')}</div>
                )}
                <ul className="small link-list">
                  {related.slice(0, 6).map((lesson) => (
                    <li key={lesson.id}>
                      <Link to={`/lesson/${lesson.id}`}>{b(lesson.title)}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {written.length === 0 && related.length === 0 && (
              <div className="small muted" style={{ marginTop: 12 }}>{t('noNotesForSectionYet')}</div>
            )}

            <details className="topics">
              <summary>
                {t('topicsCovered')} · {n(section.topics.length)}
              </summary>
              <ul className="small">
                {section.topics.map((topic, i) => <li key={i}>{b(topic)}</li>)}
              </ul>
            </details>

            <div className="row" style={{ marginTop: 12 }}>
              {section.subjectIds.map((id) => {
                const subject = SUBJECT_BY_ID[id];
                if (!subject) return null;
                return (
                  <Link key={id} to={`/study/${id}`} className="btn btn-sm btn-ghost">
                    <span aria-hidden="true">{subject.icon}</span> {b(subject.short)}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
