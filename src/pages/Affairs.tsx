import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { CURRENT_AFFAIRS_NOTE, affairsByMonth, monthLabel } from '../data/currentAffairs';
import { Empty } from '../components/Empty';

export function Affairs() {
  const { t, b, lang, n } = useLang();
  const { levelId } = useProgress();

  const months = affairsByMonth(levelId ?? undefined);
  const unverified = months.reduce(
    (sum, m) => sum + m.items.filter((i) => i.status === 'unverified').length,
    0,
  );

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('navAffairs')}</div>
        <h1 className="display">{t('navAffairs')}</h1>
      </div>

      <div className="notice tone-tip">
        <div className="small">{b(CURRENT_AFFAIRS_NOTE)}</div>
      </div>

      {unverified > 0 && (
        <div className="row small muted">
          <span className="pill pill-warn">
            {n(unverified)} {t('needsChecking')}
          </span>
        </div>
      )}

      {months.length === 0 ? (
        <Empty icon="📰">{t('noResults')}</Empty>
      ) : (
        months.map(({ month, items }) => (
          <section key={month}>
            <div className="month-head">
              <h2 className="display">{monthLabel(month, lang)}</h2>
              <span className="tiny muted">
                {n(items.length)} {t(items.length === 1 ? 'oneEntry' : 'manyEntries')}
              </span>
            </div>
            <div className="stack">
              {items.map((item) => (
                <article className={`card${item.status === 'unverified' ? ' unverified' : ''}`} key={item.id}>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <span className="pill pill-accent">{b(item.category)}</span>
                    {item.status === 'unverified' && (
                      <span className="pill pill-warn">⚠ {t('needsChecking')}</span>
                    )}
                  </div>
                  <h3>{b(item.title)}</h3>
                  <p className="small" style={{ marginBottom: item.checkNote ? 10 : 0 }}>
                    {b(item.detail)}
                  </p>

                  {item.checkNote && (
                    <div className="notice tone-warn">
                      <div className="small">
                        <strong>{t('beforeYouTrustThis')} </strong>
                        {b(item.checkNote)}
                      </div>
                    </div>
                  )}

                  {item.sources && item.sources.length > 0 && (
                    <div className="tiny muted" style={{ marginTop: 8 }}>
                      {t('reportedBy')}:{' '}
                      {item.sources.map((src, i) => (
                        <span key={src}>
                          {i > 0 && ', '}
                          <a href={src} target="_blank" rel="noopener noreferrer">
                            {new URL(src).hostname.replace(/^www\./, '')}
                          </a>
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
