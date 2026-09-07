import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Bilingual, Lang } from '../types';
import { UI, localiseNumber, type UiKey } from './strings';

/**
 * The medium is the language a candidate studies and answers in, chosen once
 * on the way into the app. It is also the interface language — keeping one
 * value rather than two means the top bar and the medium can never disagree.
 */
const STORAGE_KEY = 'lss.medium';

interface LanguageValue {
  lang: Lang;
  /** False until the candidate has picked a medium on the way in. */
  mediumChosen: boolean;
  setLang: (lang: Lang) => void;
  /** Record the medium chosen on the entry screen. */
  chooseMedium: (lang: Lang) => void;
  toggle: () => void;
  /** Translate a UI key. */
  t: (key: UiKey) => string;
  /** Pick the active language out of a bilingual content value. */
  b: (value: Bilingual) => string;
  /** Localise digits (Devanagari numerals in Nepali). */
  n: (value: number | string) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

function readStored(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ne') return stored;
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return null;
}

/**
 * The language this build used before the medium screen existed. It seeds the
 * entry screen so a returning candidate confirms rather than starts over, but
 * it is not treated as a medium choice: the screen still shows once, because
 * the medium carries an exam rule a language toggle never told anyone about.
 */
function readLegacyLang(): Lang | null {
  try {
    const stored = localStorage.getItem('lss.lang');
    if (stored === 'en' || stored === 'ne') return stored;
  } catch {
    // Ignore — the default below is fine.
  }
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const stored = readStored();
  const [lang, setLangState] = useState<Lang>(() => stored ?? readLegacyLang() ?? 'ne');
  const [mediumChosen, setMediumChosen] = useState(stored !== null);

  useEffect(() => {
    document.documentElement.lang = lang === 'ne' ? 'ne' : 'en';
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const persist = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the choice simply will not persist.
    }
  }, []);

  // Switching language in the top bar switches the medium with it, so the
  // two can never drift apart. It only persists once a medium exists, or the
  // entry screen would be skipped by a stray tap on the way past it.
  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      if (mediumChosen) persist(next);
    },
    [mediumChosen, persist],
  );

  const chooseMedium = useCallback(
    (next: Lang) => {
      setLangState(next);
      setMediumChosen(true);
      persist(next);
    },
    [persist],
  );

  const toggle = useCallback(() => setLangState((cur) => (cur === 'en' ? 'ne' : 'en')), []);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      mediumChosen,
      setLang,
      chooseMedium,
      toggle,
      t: (key) => UI[key][lang],
      b: (content) => content[lang],
      n: (num) => localiseNumber(num, lang),
    }),
    [lang, mediumChosen, setLang, chooseMedium, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside a LanguageProvider');
  return ctx;
}
