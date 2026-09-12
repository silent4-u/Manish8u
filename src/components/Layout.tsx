import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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

/** The six screens the tab bar reaches. Everywhere else needs a way back. */
const TAB_PATHS = new Set<string>(TABS.map((tab) => tab.to));

/**
 * Where back goes when a screen was opened directly — a shared link, a
 * restored tab, a notification — and there is no in-app history behind it.
 * Without this, back on a deep link would leave the app entirely.
 */
function parentOf(pathname: string): string {
  if (pathname.startsWith('/lesson/') || pathname.startsWith('/study/')) return '/study';
  if (pathname.startsWith('/first-paper/')) return '/first-paper';
  if (pathname.startsWith('/written/')) {
    // /written/:paperId/:questionId goes back to the paper, not past it.
    const parts = pathname.split('/').filter(Boolean);
    return parts.length > 2 ? `/written/${parts[1]}` : '/written';
  }
  if (pathname.startsWith('/practice/')) return '/practice';
  if (pathname.startsWith('/paper/')) return '/syllabus';
  return '/';
}

export function Layout() {
  const { t, b, lang, setLang } = useLang();
  const { levelId } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const level = levelId ? LEVEL_BY_ID[levelId] : null;
  // The medium screen is the choice the top bar's toggle would duplicate, and
  // every tab behind it needs a level that has not been picked yet.
  const onboarding = pathname === '/start';
  const showBack = !onboarding && !TAB_PATHS.has(pathname);

  function goBack() {
    // A location key of 'default' means this is the first entry in the history
    // stack, so `navigate(-1)` would step out of the app instead of back.
    if (location.key === 'default') navigate(parentOf(pathname), { replace: true });
    else navigate(-1);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-lead">
          {showBack && (
            <button type="button" className="back-btn" onClick={goBack} aria-label={t('back')}>
              <span aria-hidden="true">←</span>
            </button>
          )}
          <Link to="/" className="brand">
            {!showBack && <span className="brand-mark" aria-hidden="true">लो</span>}
            <span className="brand-text">
              <span className="brand-name">{t('appName')}</span>
              <span className="brand-sub">{t('tagline')}</span>
            </span>
          </Link>
        </div>

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
