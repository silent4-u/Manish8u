import { useLang } from '../i18n/LanguageContext';
import { LESSONS } from '../data/lessons';
import { QUESTIONS } from '../data/questions';
import { LEVELS, SYLLABUS_REVISION_NOTE } from '../data/levels';

/** Set at build time from package.json. */
const APP_VERSION = __APP_VERSION__;

/** Replace before a commercial release. */
const CONTACT_EMAIL = 'hello@example.com';
const PRIVACY_URL = 'https://example.com/privacy';

export function About() {
  const { t, b, n } = useLang();

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('appName')}</div>
        <h1 className="display">{t('aboutTitle')}</h1>
        <p className="muted small">
          {t('version')} {n(APP_VERSION)}
        </p>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value">{n(LEVELS.length)}</div>
          <div className="stat-label">{t('examsCovered')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(LESSONS.length)}</div>
          <div className="stat-label">{t('lessons')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(QUESTIONS.length)}</div>
          <div className="stat-label">{t('questions')}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.02rem' }}>{t('aboutContentTitle')}</h2>
        <p className="small">{b(SYLLABUS_REVISION_NOTE)}</p>
        <div className="notice tone-warn">
          <div className="small">{t('notAffiliated')}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.02rem' }}>{t('aboutPrivacyTitle')}</h2>
        <p className="small">{t('aboutPrivacyBody')}</p>
        <ul className="small">
          <li>{t('privacyNoAccount')}</li>
          <li>{t('privacyNoTracking')}</li>
          <li>{t('privacyLocalOnly')}</li>
          <li>{t('privacyFilesLocal')}</li>
        </ul>
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
          {t('privacyPolicy')}
        </a>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.02rem' }}>{t('aboutContactTitle')}</h2>
        <p className="small">{t('aboutContactBody')}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-sm">
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
