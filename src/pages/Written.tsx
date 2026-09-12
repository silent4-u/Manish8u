import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LEVEL_BY_ID } from '../data/levels';
import { WRITTEN_BY_ID, WRITTEN_QUESTIONS, writtenFor } from '../data/written';
import { writtenCoverage, writtenGroups, targetWords } from '../lib/written';
import { Empty } from '../components/Empty';

/** The written papers of the chosen post, with how far practice covers each. */
export function WrittenPicker() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  const groups = useMemo(
    () => (level ? writtenGroups(level, WRITTEN_QUESTIONS) : []),
    [level],
  );

  if (!level) return null;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{b(level.shortName)}</div>
        <h1 className="display">{t('writtenTitle')}</h1>
        <p className="small muted" style={{ marginBottom: 0 }}>{t('writtenLede')}</p>
      </div>

      {groups.map((group) => {
        const coverage = writtenCoverage(group);
        return (
          <Link
            key={group.paper.id}
            to={`/written/${group.paper.id}`}
            className="card"
            style={{ display: 'block', color: 'inherit' }}
          >
            <div className="between" style={{ alignItems: 'flex-start' }}>
              <div>
                <strong>{b(group.paper.name)}</strong>
                <div className="small muted">{b(group.paper.pattern)}</div>
              </div>
              <span className="pill pill-accent">{n(group.paper.fullMarks)}</span>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {group.questions.length === 0 ? (
                <span className="pill pill-warn">{t('writtenNoneYet')}</span>
              ) : (
                <>
                  <span className="pill">
                    {n(group.questions.length)} {t('writtenQuestions')}
                  </span>
                  <span className="pill">
                    {n(coverage)}% {t('writtenOfPaper')}
                  </span>
                </>
              )}
            </div>
          </Link>
        );
      })}

      <div className="notice tone-tip">
        <div className="small">{t('writtenVsQuiz')}</div>
      </div>
    </div>
  );
}

/** Every long-answer question for one paper, under its syllabus section. */
export function WrittenPaper() {
  const { paperId = '' } = useParams();
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const navigate = useNavigate();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  const group = useMemo(() => {
    if (!level) return null;
    return writtenGroups(level, WRITTEN_QUESTIONS).find((g) => g.paper.id === paperId) ?? null;
  }, [level, paperId]);

  if (!level) return null;

  if (!group) {
    return (
      <div className="stack">
        <Empty icon="📄">{t('writtenNoPaper')}</Empty>
        <button type="button" className="btn" onClick={() => navigate('/written')}>{t('back')}</button>
      </div>
    );
  }

  const rows = (questions: typeof group.questions) =>
    questions.map((question) => (
      <Link
        key={question.id}
        to={`/written/${group.paper.id}/${question.id}`}
        className="written-row"
      >
        <span>{b(question.prompt)}</span>
        <span className="tiny muted mono-num written-row-marks">
          {n(question.marks)} {t('marks')}
        </span>
      </Link>
    ));

  return (
    <div className="stack">
      <div>
        <div className="breadcrumb">
          <Link to="/written">{t('writtenTitle')}</Link> / {b(level.shortName)}
        </div>
        <h1 className="display">{b(group.paper.name)}</h1>
        <p className="small muted" style={{ marginBottom: 0 }}>{b(group.paper.pattern)}</p>
      </div>

      {group.questions.length === 0 && <Empty icon="✍️">{t('writtenNoneYet')}</Empty>}

      {group.sections.map((entry) =>
        entry.questions.length === 0 ? null : (
          <section key={entry.section.id}>
            <div className="eyebrow">{b(entry.section.name)}</div>
            <div className="written-list">{rows(entry.questions)}</div>
          </section>
        ),
      )}

      {group.general.length > 0 && (
        <section>
          <div className="eyebrow">{t('wholePaper')}</div>
          <div className="written-list">{rows(group.general)}</div>
        </section>
      )}
    </div>
  );
}

/**
 * One question, its model answer, and somewhere to attempt it.
 *
 * The reveal is staged on purpose. Seeing the model answer beside the
 * question teaches recognition, which is not what the paper tests: a
 * candidate has to produce the structure from memory. So the answer stays
 * shut until it is asked for, and the attempt box comes first.
 */
export function WrittenAnswerView() {
  const { paperId = '', questionId = '' } = useParams();
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const navigate = useNavigate();
  const question = WRITTEN_BY_ID[questionId];
  const [showKey, setShowKey] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [draft, setDraft] = useLocalStorage<string>(`lss.written.draft.${questionId}`, '');

  if (!levelId) return null;

  if (!question) {
    return (
      <div className="stack">
        <Empty icon="📄">{t('writtenNoQuestion')}</Empty>
        <button type="button" className="btn" onClick={() => navigate('/written')}>{t('back')}</button>
      </div>
    );
  }

  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const target = targetWords(question.marks);
  const level = LEVEL_BY_ID[levelId];
  const paper = level.papers.find((p) => p.id === (paperId || question.paperId));

  return (
    <div className="stack">
      <div>
        <div className="breadcrumb">
          <Link to="/written">{t('writtenTitle')}</Link>
          {paper && <> / <Link to={`/written/${paper.id}`}>{b(paper.name).split('—')[0].trim()}</Link></>}
        </div>
        <div className="row">
          <span className="pill pill-accent">{n(question.marks)} {t('marks')}</span>
          <span className="pill">{n(question.minutes)} {t('minutes')}</span>
          <span className="pill">{n(target.min)}–{n(target.max)} {t('words')}</span>
        </div>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '1.05rem', marginBottom: 0 }}>{b(question.prompt)}</h1>
      </div>

      <div className="card">
        <div className="eyebrow">{t('writtenYourAttempt')}</div>
        <textarea
          className="input written-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('writtenAttemptHint')}
          rows={10}
        />
        <div className="between" style={{ marginTop: 8 }}>
          <span className="tiny muted mono-num">
            {n(words)} {t('words')}
          </span>
          {draft.trim().length > 0 && (
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDraft('')}>
              {t('clear')}
            </button>
          )}
        </div>
        <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>{t('writtenDraftLocal')}</p>
      </div>

      <div className="card">
        <div className="between">
          <div className="eyebrow" style={{ marginBottom: 0 }}>{t('writtenKeyPoints')}</div>
          <button
            type="button"
            className="btn btn-sm"
            aria-expanded={showKey}
            onClick={() => setShowKey((open) => !open)}
          >
            {showKey ? t('hide') : t('show')}
          </button>
        </div>
        {showKey && (
          <ul style={{ marginTop: 12, marginBottom: 0 }}>
            {question.keyPoints.map((point, i) => (
              <li key={i}>{b(point)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="between">
          <div className="eyebrow" style={{ marginBottom: 0 }}>{t('writtenModelAnswer')}</div>
          <button
            type="button"
            className={`btn btn-sm${showAnswer ? '' : ' btn-primary'}`}
            aria-expanded={showAnswer}
            onClick={() => setShowAnswer((open) => !open)}
          >
            {showAnswer ? t('hide') : t('show')}
          </button>
        </div>

        {showAnswer && (
          <div className="lesson-body written-answer" style={{ marginTop: 12 }}>
            <div className="notice tone-warn">
              <div className="small">{t('writtenModelFuller')}</div>
            </div>
            <p>{b(question.intro)}</p>
            {question.parts.map((part, i) => (
              <div key={i}>
                <h3>{b(part.heading)}</h3>
                <ul>
                  {part.points.map((point, j) => (
                    <li key={j}>{b(point)}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h3>{t('writtenConclusion')}</h3>
            <p>{b(question.conclusion)}</p>

            {question.authorities && question.authorities.length > 0 && (
              <div className="notice tone-tip">
                <div className="small">
                  <strong>{t('writtenAuthorities')}</strong>
                  <ul className="link-list">
                    {question.authorities.map((item, i) => (
                      <li key={i}>{b(item)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {question.freshnessNote && (
              <div className="notice tone-warn">
                <div className="small">{b(question.freshnessNote)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Count for the home screen and the practice picker. */
export function writtenCount(levelId: Parameters<typeof writtenFor>[0]): number {
  return writtenFor(levelId).length;
}
