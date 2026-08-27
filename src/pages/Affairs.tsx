import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { CURRENT_AFFAIRS, CURRENT_AFFAIRS_NOTE } from '../data/currentAffairs';
import { Empty } from '../components/Empty';

export function Affairs() {
  const { t, b, lang } = useLang();
  const { levelId } = useProgress();

  const items = CURRENT_AFFAIRS
    .filter((item) => !levelId || item.levels.includes(levelId))
    .slice()
    .sort((a, b2) => b2.date.localeCompare(a.date));

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('navAffairs')}</div>
        <h1 className="display">{t('navAffairs')}</h1>
      </div>

      <div className="notice tone-tip">
        <div className="small">{b(CURRENT_AFFAIRS_NOTE)}</div>
      </div>

      {items.length === 0 ? (
        <Empty icon="📰">{t('noResults')}</Empty>
      ) : (
        <div className="stack">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <div className="row" style={{ marginBottom: 6 }}>
                <span className="pill pill-accent">{b(item.category)}</span>
                <span className="tiny muted">
                  {new Date(item.date).toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <h3>{b(item.title)}</h3>
              <p className="small" style={{ marginBottom: 0 }}>{b(item.detail)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
