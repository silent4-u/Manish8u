import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVELS, SYLLABUS_REVISION_NOTE } from '../data/levels';

export function LevelSelect() {
  const { t, b, n } = useLang();
  const { levelId, setLevelId } = useProgress();
  const navigate = useNavigate();

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('appName')}</div>
        <h1 className="display">{t('chooseLevel')}</h1>
        <p className="muted">{t('tagline')}</p>
      </div>

      <div className="grid">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            className={`level-card${levelId === level.id ? ' selected' : ''}`}
            style={{ ['--level-accent' as string]: level.accent }}
            onClick={() => {
              setLevelId(level.id);
              navigate('/');
            }}
          >
            <div className="row" style={{ marginBottom: 6 }}>
              <span className="level-icon" aria-hidden="true">{level.icon}</span>
              <div>
                <h2 style={{ marginBottom: 2 }}>{b(level.name)}</h2>
                <div className="small muted">{b(level.grade)}</div>
              </div>
            </div>
            <p className="small" style={{ marginBottom: 8 }}>{b(level.summary)}</p>
            <div className="row">
              <span className="pill">
                {n(level.papers.length)} {t('paper')}
              </span>
              <span className="pill">
                {n(level.papers.reduce((sum, p) => sum + p.fullMarks, 0))} {t('marks')}
              </span>
              <span className="pill pill-accent">{b(level.minQualification)}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="notice tone-tip">
        <div>
          <strong className="small">{t('syllabusNotice')}</strong>
          <div className="small">{b(SYLLABUS_REVISION_NOTE)}</div>
        </div>
      </div>
    </div>
  );
}
