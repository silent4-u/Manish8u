import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { LEVELS } from '../data/levels';
import type { Lang } from '../types';

/**
 * The way into the app. A candidate picks the medium they will study and
 * answer in before anything else, because it is an exam decision and not only
 * an interface preference — the commission lets you answer in Nepali, English
 * or both, and for Kharidar the question paper itself arrives in Nepali.
 *
 * This screen is deliberately written in both languages at once: it runs
 * before a language has been chosen, so it cannot lean on the translation
 * helper the way every other screen does.
 */
const OPTIONS: { id: Lang; title: string; sub: string; body: string; script: string }[] = [
  {
    id: 'ne',
    title: 'नेपाली माध्यम',
    sub: 'Nepali medium',
    body: 'पाठ, प्रश्न र व्याख्या सबै नेपालीमा। अङ्क पनि देवनागरीमा देखिन्छ।',
    script: 'Notes, questions and explanations in Nepali, with Devanagari numerals.',
  },
  {
    id: 'en',
    title: 'English Medium',
    sub: 'अंग्रेजी माध्यम',
    body: 'Notes, questions and explanations in English, in the commission’s own wording.',
    script: 'पाठ, प्रश्न र व्याख्या अंग्रेजीमा, आयोगकै शब्दावलीमा।',
  },
];

export function Medium() {
  const { lang, chooseMedium } = useLang();
  const navigate = useNavigate();

  function pick(next: Lang) {
    chooseMedium(next);
    navigate('/levels', { replace: true });
  }

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">लोक सेवा साथी · Lok Sewa Sathi</div>
        <h1 className="display" style={{ marginBottom: 6 }}>
          माध्यम छान्नुहोस्
          <span className="muted" style={{ display: 'block', fontSize: '1.1rem' }}>
            Choose your medium
          </span>
        </h1>
        <p className="small muted" style={{ marginBottom: 0 }}>
          तपाईंले अध्ययन गर्ने र उत्तर लेख्ने भाषा। पछि जुनसुकै बेला बदल्न सकिन्छ।
          <br />
          The language you study and answer in. You can change it at any time.
        </p>
      </div>

      <div className="stack">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`medium-card${lang === option.id ? ' selected' : ''}`}
            onClick={() => pick(option.id)}
          >
            <span className="medium-badge" aria-hidden="true">{option.id === 'ne' ? 'ने' : 'EN'}</span>
            <span>
              <strong style={{ fontSize: '1.05rem' }}>{option.title}</strong>
              <div className="small muted">{option.sub}</div>
              <div className="small" style={{ marginTop: 6 }}>{option.body}</div>
              <div className="tiny muted" style={{ marginTop: 4 }}>{option.script}</div>
            </span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="eyebrow">परीक्षामा के मिल्छ · What the exam allows</div>
        <p className="small" style={{ marginTop: 6 }}>
          यो एपको माध्यम हो — परीक्षाको नियम आयोगले तोक्छ:
          <br />
          This sets the app. The commission sets the exam:
        </p>
        <ul className="small" style={{ marginBottom: 0 }}>
          {LEVELS.map((level) => (
            <li key={level.id} style={{ marginBottom: 6 }}>
              <strong>{level.name.ne} · {level.name.en}</strong>
              <div className="tiny muted">{level.id === 'kharidar'
                ? 'प्रश्नपत्र नेपालीमा; उत्तर नेपाली, अंग्रेजी वा दुवैमा। Question paper in Nepali; answer in Nepali, English or both.'
                : 'उत्तर नेपाली, अंग्रेजी वा दुवैमा। Answer in Nepali, English or both.'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
