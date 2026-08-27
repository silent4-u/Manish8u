import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Bilingual, Lang } from '../types';
import { UI, localiseNumber, type UiKey } from './strings';

const STORAGE_KEY = 'lss.lang';

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Translate a UI key. */
  t: (key: UiKey) => string;
  /** Pick the active language out of a bilingual content value. */
  b: (value: Bilingual) => string;
  /** Localise digits (Devanagari numerals in Nepali). */
  n: (value: number | string) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function readStored(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ne') return stored;
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return 'ne';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  useEffect(() => {
    document.documentElement.lang = lang === 'ne' ? 'ne' : 'en';
    document.documentElement.dataset.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage failures; the choice simply will not persist.
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(() => setLangState((cur) => (cur === 'en' ? 'ne' : 'en')), []);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (key) => UI[key][lang],
      b: (content) => content[lang],
      n: (num) => localiseNumber(num, lang),
    }),
    [lang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside a LanguageProvider');
  return ctx;
}
