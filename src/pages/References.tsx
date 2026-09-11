import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { REFERENCES } from '../data/references';

/**
 * The primary sources a syllabus answer should rest on.
 *
 * The app does not ship these documents — they are large, they are revised on
 * their own schedule, and their contents are exact figures that must come from
 * the publisher. What it can do is tell a candidate which document answers
 * which part of their own paper, which is the thing that is genuinely hard to
 * work out, and where the publisher keeps it.
 */
export function References() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  if (!level) return null;

  const mine = REFERENCES.filter((ref) => ref.levels.includes(level.id));

  /** The papers of this post that a document is a primary source for. */
  function papersFor(covers: string[]) {
    return level!.papers.filter((paper) =>
      paper.sections.some((section) => covers.includes(section.id)),
    );
  }

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{b(level.name)}</div>
        <h1 className="display">{t('primarySources')}</h1>
        <p className="small muted" style={{ marginBottom: 0 }}>{t('primarySourcesLede')}</p>
      </div>

      <div className="notice tone-tip">
        <div className="small">{t('primarySourcesHow')}</div>
      </div>

      {mine.map((ref) => {
        const papers = papersFor(ref.covers);
        return (
          <section className="card" key={ref.id}>
            <h2 style={{ fontSize: '1.02rem', marginBottom: 2 }}>{b(ref.title)}</h2>
            <div className="tiny muted">{b(ref.publisher)}</div>

            <p className="small" style={{ marginTop: 10 }}>{b(ref.what)}</p>

            <div className="row" style={{ marginTop: 4 }}>
              <span className="pill pill-warn">{b(ref.cadence)}</span>
            </div>

            {papers.length > 0 && (
              <>
                <hr className="divider" />
                <div className="eyebrow">{t('answersTheseP')}</div>
                <div className="row">
                  {papers.map((paper) => (
                    <Link key={paper.id} to={`/paper/${paper.id}`} className="btn btn-sm">
                      {b(paper.name).split('—')[0].trim()}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="tiny muted" style={{ marginTop: 12 }}>
              {t('publishedAt')}: <strong>{ref.site}</strong>
            </div>
          </section>
        );
      })}

      <div className="notice">
        <div className="small">{t('primarySourcesRights')}</div>
      </div>

      <Link to="/materials" className="btn btn-block">
        {t('navMaterials')} · {n(mine.length)} {t('primarySourcesToFile')}
      </Link>
    </div>
  );
}
