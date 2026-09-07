import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';

const TABS = [
  { to: '/', icon: '🏠', key: 'navHome', end: true },
  { to: '/syllabus', icon: '📜', key: 'navSyllabus', end: false },
  { to: '/study', icon: '📚', key: 'navStudy', end: false },
  { to: '/practice', icon: '✍️', key: 'navPractice', end: false },
  { to: '/mock', icon: '⏱️', key: 'navMock', end: false },
  { to: '/progress', icon: '📊', key: 'navProgress', end: false },
] as const;

export function Layout() {
  const { t, b, lang, setLang } = useLang();
  const { levelId } = useProgress();
  const { pathname } = useLocation();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;
  // The medium screen is the choice the top bar's toggle would duplicate, and
  // every tab behind it needs a level that has not been picked yet.
  const onboarding = pathname === '/start';

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">लो</span>
          <span className="brand-text">
            <span className="brand-name">{t('appName')}</span>
            <span className="brand-sub">{t('tagline')}</span>
          </span>
        </Link>

        <span className="topbar-spacer" />

        {level && (
          <Link to="/levels" className="level-chip" title={t('changeLevel')} aria-label={`${t('changeLevel')}: ${b(level.name)}`}>
            <span aria-hidden="true">{level.icon}</span>
            <span className="chip-label">{b(level.shortName)}</span>
          </Link>
        )}

        {!onboarding && (
        <div className="lang-switch" role="group" aria-label={t('language')}>
          <button type="button" aria-pressed={lang === 'ne'} onClick={() => setLang('ne')}>
            नेपाली
          </button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
        )}
      </header>

      <main className="shell">
        <Outlet />
      </main>

      {!onboarding && (
      <nav className="tabbar" aria-label={t('navHome')}>
        <div className="tabbar-inner">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
            >
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span>{t(tab.key)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      )}
    </div>
  );
}
