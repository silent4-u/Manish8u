import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { LEVELS, LEVEL_BY_ID } from '../data/levels';
import { Empty } from '../components/Empty';
import {
  ACCEPTED_TYPES,
  defaultTitle,
  formatBytes,
  headerMatches,
  kindOf,
  rejectReason,
  topicsOf,
  type MaterialKind,
} from '../lib/materials';
import { WATERMARK_TEXT, stampImage, stampPdf } from '../lib/watermark';
import {
  FAKE_CREDENTIALS,
  getLibrary,
  libraryIsLive,
  type LibraryUser,
  type RemoteMaterial,
} from '../lib/library';
import type { LevelId } from '../types';

/**
 * The owner's publishing desk.
 *
 * Everything here is the owner's own work: sign in, choose where a file
 * belongs in the syllabus, and put it up so every customer sees it on their
 * next visit. No redeploy, which is the whole reason this exists.
 *
 * The file is watermarked in this browser before it is uploaded, so the bytes
 * sitting at the public URL already carry the mark. That is the version that
 * has no unstamped original behind it.
 *
 * Nothing on this screen is a security boundary. Hiding the form from a
 * signed-out visitor is presentation; a signed-in non-owner is refused by the
 * service's own rules, at the service.
 */
export function Publish() {
  const { t, b, n } = useLang();
  const library = useMemo(() => getLibrary(), []);
  const live = libraryIsLive();

  const [user, setUser] = useState<LibraryUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState<RemoteMaterial[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<MaterialKind>('pdf');
  const [title, setTitle] = useState('');
  const [levelId, setLevelId] = useState<LevelId>('adhikrit');
  const [paperId, setPaperId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [topicId, setTopicId] = useState('');

  const level = LEVEL_BY_ID[levelId];
  const paper = level.papers.find((p) => p.id === paperId) ?? null;
  const section = paper?.sections.find((s) => s.id === sectionId) ?? null;

  const refresh = useCallback(async () => {
    setPublished(await library.list());
  }, [library]);

  useEffect(() => {
    void (async () => {
      setUser(await library.currentUser());
      setChecking(false);
      await refresh();
    })();
  }, [library, refresh]);

  async function submitSignIn() {
    setBusy(true);
    setError(null);
    try {
      setUser(await library.signIn(email.trim(), password));
      setPassword('');
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function choose(chosen: File) {
    setError(null);
    setNote(null);
    const reason = rejectReason(chosen);
    if (reason) {
      setError(t(reason === 'too-large' ? 'materialTooLarge' : 'materialNotSupported'));
      return;
    }
    const detected = kindOf(chosen);
    const head = new Uint8Array(await chosen.slice(0, 1024).arrayBuffer());
    if (!detected || !headerMatches(detected, head)) {
      setError(t('materialNotSupported'));
      return;
    }
    setFile(chosen);
    setKind(detected);
    setTitle(defaultTitle(chosen.name));
  }

  async function publish() {
    if (!file || !paper) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      // Stamp here, before upload: what lands at the public URL is marked,
      // so there is no clean copy to find behind it.
      const stamped =
        kind === 'image'
          ? await stampImage(file)
          : new Blob([(await stampPdf(await file.arrayBuffer())).slice()], { type: 'application/pdf' });

      await library.publish(
        {
          levelId,
          paperId: paper.id,
          sectionId: sectionId || null,
          topicId: topicId || null,
          title: title.trim() || file.name,
          fileName: file.name,
          kind,
        },
        stamped,
      );
      setNote(t('publishDone'));
      setFile(null);
      setTitle('');
      setTopicId('');
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function withdraw(item: RemoteMaterial) {
    setBusy(true);
    setError(null);
    try {
      await library.unpublish(item.id);
      await refresh();
      setNote(t('publishWithdrawn'));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (checking) return null;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{library.name}</div>
        <h1 className="display">{t('publishTitle')}</h1>
        <p className="small muted" style={{ marginBottom: 0 }}>{t('publishLede')}</p>
      </div>

      {!live && (
        <div className="notice tone-warn">
          <div className="small">
            {t('publishPreviewWarning')}
            <div className="tiny muted" style={{ marginTop: 6 }}>
              {FAKE_CREDENTIALS.email} / {FAKE_CREDENTIALS.password}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="notice tone-warn">
          <div className="small">{error}</div>
        </div>
      )}
      {note && (
        <div className="notice tone-tip">
          <div className="small">{note}</div>
        </div>
      )}

      {!user ? (
        <div className="card">
          <h2 style={{ fontSize: '1rem' }}>{t('publishSignIn')}</h2>
          <div className="stack" style={{ marginTop: 10 }}>
            <div>
              <label className="tiny muted" htmlFor="publish-email">{t('publishEmail')}</label>
              <input
                id="publish-email"
                className="input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="tiny muted" htmlFor="publish-password">{t('publishPassword')}</label>
              <input
                id="publish-password"
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void submitSignIn()}>
                {busy ? t('publishWorking') : t('publishSignIn')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="between">
              <div>
                <strong>{user.email}</strong>
                <div className="tiny muted">{t('publishSignedIn')}</div>
              </div>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => void library.signOut().then(() => setUser(null))}>
                {t('publishSignOut')}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1rem' }}>{t('publishNew')}</h2>

            <label className="btn btn-sm file-label" style={{ marginTop: 8 }}>
              {file ? file.name : t('chooseFile')}
              <input
                className="file-input"
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={(e) => {
                  const chosen = e.target.files?.[0];
                  if (chosen) void choose(chosen);
                }}
              />
            </label>

            {file && (
              <div className="stack" style={{ marginTop: 12 }}>
                <div className="row">
                  <span className="pill">{t(kind === 'image' ? 'materialPhoto' : 'materialPdf')}</span>
                  <span className="pill">{n(formatBytes(file.size))}</span>
                  <span className="pill pill-accent">{WATERMARK_TEXT}</span>
                </div>

                <div>
                  <label className="tiny muted" htmlFor="publish-title">{t('materialTitle')}</label>
                  <input id="publish-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                  <label className="tiny muted" htmlFor="publish-level">{t('chooseLevel')}</label>
                  <select
                    id="publish-level"
                    className="input"
                    value={levelId}
                    onChange={(e) => {
                      setLevelId(e.target.value as LevelId);
                      setPaperId('');
                      setSectionId('');
                      setTopicId('');
                    }}
                  >
                    {LEVELS.map((entry) => (
                      <option key={entry.id} value={entry.id}>{b(entry.name)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="tiny muted" htmlFor="publish-paper">{t('fileUnder')}</label>
                  <select
                    id="publish-paper"
                    className="input"
                    value={paperId}
                    onChange={(e) => {
                      setPaperId(e.target.value);
                      setSectionId('');
                      setTopicId('');
                    }}
                  >
                    <option value="">{t('publishChoosePaper')}</option>
                    {level.papers.map((entry) => (
                      <option key={entry.id} value={entry.id}>{b(entry.name)}</option>
                    ))}
                  </select>
                </div>

                {paper && (
                  <div>
                    <label className="tiny muted" htmlFor="publish-section">{t('publishSection')}</label>
                    <select
                      id="publish-section"
                      className="input"
                      value={sectionId}
                      onChange={(e) => {
                        setSectionId(e.target.value);
                        setTopicId('');
                      }}
                    >
                      <option value="">{t('wholePaper')}</option>
                      {paper.sections.map((entry) => (
                        <option key={entry.id} value={entry.id}>{b(entry.name)}</option>
                      ))}
                    </select>
                  </div>
                )}

                {section && (
                  <div>
                    <label className="tiny muted" htmlFor="publish-topic">{t('materialTopic')}</label>
                    <select id="publish-topic" className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                      <option value="">{t('materialWholeSection')}</option>
                      {topicsOf(section).map((topic) => (
                        <option key={topic.id} value={topic.id}>{b(topic.text)}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="row">
                  <button type="button" className="btn btn-primary" disabled={busy || !paper} onClick={() => void publish()}>
                    {busy ? t('publishWorking') : t('publishNow')}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setFile(null)}>
                    {t('cancel')}
                  </button>
                </div>
                <p className="tiny muted" style={{ marginBottom: 0 }}>{t('publishStampNote')}</p>
              </div>
            )}
          </div>
        </>
      )}

      <section>
        <div className="eyebrow">{t('publishLive')}</div>
        {published.length === 0 ? (
          <Empty icon="📭">{t('publishNothingYet')}</Empty>
        ) : (
          <div className="stack">
            {published.map((item) => (
              <div className="card" key={item.id}>
                <div className="between" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{item.title}</strong>
                    <div className="tiny muted">{item.fileName}</div>
                  </div>
                  <span className="pill pill-accent">{t(item.kind === 'image' ? 'materialPhoto' : 'materialPdf')}</span>
                </div>
                <div className="row" style={{ marginTop: 8 }}>
                  <span className="pill">{b(LEVEL_BY_ID[item.levelId].shortName)}</span>
                  <span className="pill">{item.paperId}</span>
                  {item.topicId && <span className="pill">{item.topicId}</span>}
                  <span className="pill">{n(formatBytes(item.size))}</span>
                </div>
                {user && (
                  <div className="row" style={{ marginTop: 10 }}>
                    <button type="button" className="btn btn-sm btn-danger" disabled={busy} onClick={() => void withdraw(item)}>
                      {t('publishWithdraw')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
