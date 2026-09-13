import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID } from '../data/levels';
import { CATALOGUE } from '../data/materials';
import { MATERIAL_CONTENTS } from '../data/materialChapters';
import { Empty } from '../components/Empty';
import { MaterialView } from '../components/MaterialView';
import { WATERMARK_TEXT, stampImage, stampPdf, stampedName } from '../lib/watermark';
import { asMaterialMeta, getLibrary } from '../lib/library';
import {
  ACCEPTED_TYPES,
  defaultTitle,
  formatBytes,
  headerMatches,
  kindOf,
  rejectReason,
  topicsOf,
  shelfBytes,
  shelvesFor,
  unfiledFor,
  type MaterialKind,
  type MaterialMeta,
  type RejectReason,
} from '../lib/materials';
import {
  addMaterial,
  isQuotaError,
  libraryAvailable,
  listMaterials,
  readMaterial,
  removeMaterial,
} from '../lib/materialStore';
import type { UiKey } from '../i18n/strings';

const REJECT_KEY: Record<RejectReason, UiKey> = {
  'unsupported-type': 'materialNotSupported',
  'too-large': 'materialTooLarge',
  empty: 'materialEmpty',
};

/** A viewer for one open PDF, holding the object URL it has to revoke. */
interface Preview {
  id: string;
  title: string;
  fileName: string;
  url: string;
  kind: MaterialKind;
  /** Object URLs are ours to revoke; a catalogue path is not. */
  revocable: boolean;
}

export function Materials() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  const [shelf, setShelf] = useState<MaterialMeta[]>([]);
  const [remote, setRemote] = useState<MaterialMeta[]>([]);
  const [storable, setStorable] = useState(libraryAvailable());
  const [paperId, setPaperId] = useState<string | null>(null);
  const [pending, setPending] = useState<
    { file: File; title: string; sectionId: string; topicId: string; kind: MaterialKind } | null
  >(null);
  const [message, setMessage] = useState<UiKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!libraryAvailable()) return;
    let live = true;
    listMaterials()
      .then((found) => {
        if (live) setShelf(found);
      })
      .catch(() => {
        if (live) setStorable(false);
      });
    return () => {
      live = false;
    };
  }, []);

  // The preview owns its object URL for as long as it is on screen.
  // What the owner has published since this build shipped.
  useEffect(() => {
    let live = true;
    void getLibrary()
      .list()
      .then((found) => {
        if (live) setRemote(found.map(asMaterialMeta));
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!preview?.revocable) return;
    const { url } = preview;
    return () => URL.revokeObjectURL(url);
  }, [preview]);

  /*
   * Three sources, in one list: what shipped with the app, what the owner has
   * published since, and what this candidate added themselves. The published
   * list is fetched in the background and simply does not appear when the
   * service is unreachable — an outage must not cost a reader the material
   * that is already on their device.
   */
  const materials = useMemo(
    () => [...CATALOGUE, ...remote, ...shelf],
    [remote, shelf],
  );
  const shelves = useMemo(() => (level ? shelvesFor(level, materials) : []), [level, materials]);
  const strays = useMemo(() => (level ? unfiledFor(level, materials) : []), [level, materials]);

  const openPaper = paperId ?? shelves.find((s) => s.items.length > 0)?.paper.id ?? shelves[0]?.paper.id ?? null;
  const current = shelves.find((s) => s.paper.id === openPaper) ?? null;

  const show = useCallback((key: UiKey | null) => setMessage(key), []);

  async function chooseFile(file: File) {
    show(null);
    const reason = rejectReason(file);
    if (reason) {
      show(REJECT_KEY[reason]);
      return;
    }
    const kind = kindOf(file);
    if (!kind) {
      show('materialNotSupported');
      return;
    }
    // The extension said what it is; the bytes have to agree.
    const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
    if (!headerMatches(kind, head)) {
      show('materialNotSupported');
      return;
    }
    setPending({ file, title: defaultTitle(file.name), sectionId: '', topicId: '', kind });
  }

  async function fileIt() {
    if (!pending || !level || !current) return;
    setBusy(true);
    show(null);
    const meta: MaterialMeta = {
      id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      origin: 'shelf',
      levelId: level.id,
      paperId: current.paper.id,
      sectionId: pending.sectionId || null,
      topicId: pending.topicId || null,
      kind: pending.kind,
      title: pending.title.trim() || pending.file.name,
      fileName: pending.file.name,
      size: pending.file.size,
      addedAt: Date.now(),
    };
    try {
      await addMaterial(meta, pending.file);
      setShelf((prev) => [...prev, meta]);
      setPending(null);
      if (fileInput.current) fileInput.current.value = '';
    } catch (error) {
      show(isQuotaError(error) ? 'materialQuotaFull' : 'materialSaveFailed');
    } finally {
      setBusy(false);
    }
  }

  /**
   * Hand over a copy carrying the publisher's mark.
   *
   * The stamp is applied here, on the way out, rather than to the stored
   * file: the reader keeps working against the original, and a file added
   * from a candidate's own device is not silently rewritten. Stamping a
   * ninety-page PDF takes a moment, hence the busy state.
   *
   * This marks a copy; it does not protect one. Anyone who can open a
   * published file can fetch the unstamped original from its URL. Files the
   * app ships are stamped again at publish time by `npm run stamp:materials`,
   * which is the version of this that actually has no unstamped original.
   */
  async function saveStamped(item: Preview) {
    setBusy(true);
    show(null);
    try {
      const response = await fetch(item.url);
      const stamped =
        item.kind === 'image'
          ? await stampImage(await response.blob())
          : new Blob([(await stampPdf(await response.arrayBuffer())).slice()], { type: 'application/pdf' });

      const name = stampedName(item.kind === 'image' ? `${item.fileName}` : item.fileName);
      const href = URL.createObjectURL(stamped);
      const link = document.createElement('a');
      link.href = href;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoking immediately can cancel the download on some browsers.
      setTimeout(() => URL.revokeObjectURL(href), 60_000);
      show('materialStamped');
    } catch {
      show('materialStampFailed');
    } finally {
      setBusy(false);
    }
  }

  async function openMaterial(item: MaterialMeta) {
    show(null);
    if (item.origin === 'catalogue' && item.url) {
      setPreview({
        id: item.id,
        title: item.title,
        fileName: item.fileName,
        url: item.url,
        kind: item.kind ?? 'pdf',
        revocable: false,
      });
      return;
    }
    try {
      const body = await readMaterial(item.id);
      if (!body) {
        show('materialMissing');
        return;
      }
      setPreview({
        id: item.id,
        title: item.title,
        fileName: item.fileName,
        url: URL.createObjectURL(body),
        kind: item.kind ?? 'pdf',
        revocable: true,
      });
    } catch {
      show('materialMissing');
    }
  }

  async function discard(item: MaterialMeta) {
    if (!window.confirm(t('removeMaterialConfirm'))) return;
    try {
      await removeMaterial(item.id);
    } catch {
      // The record goes either way; a stale body is reclaimed on reinstall.
    }
    setShelf((prev) => prev.filter((m) => m.id !== item.id));
    setPreview((open) => (open && open.id === item.id ? null : open));
  }

  if (!level) return null;

  const held = shelfBytes(level.id, materials);

  function card(item: MaterialMeta) {
    return (
      <div className="card" key={item.id}>
        <div className="between" style={{ alignItems: 'flex-start', gap: 10 }}>
          <div>
            <h3 style={{ marginBottom: 4, fontSize: '0.98rem' }}>
              <span aria-hidden="true">📄 </span>
              {item.title}
            </h3>
            <div className="tiny muted">{item.fileName}</div>
          </div>
          <span className={`pill${item.origin === 'catalogue' ? ' pill-accent' : ''}`}>
            {t(item.origin === 'catalogue' ? 'publishedMaterial' : 'myMaterial')}
          </span>
        </div>

        <div className="row" style={{ marginTop: 9 }}>
          <span className="pill">{t(item.kind === 'image' ? 'materialPhoto' : 'materialPdf')}</span>
          {item.size > 0 && <span className="pill">{n(formatBytes(item.size))}</span>}
          {item.watermark && (
            <span className="pill pill-warn">
              {t('watermarkedWith')}: {item.watermark}
            </span>
          )}
        </div>

        <div className="row" style={{ marginTop: 11 }}>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => void openMaterial(item)}>
            {t('openMaterial')}
          </button>
          {item.origin === 'shelf' && (
            <button type="button" className="btn btn-sm btn-danger" onClick={() => void discard(item)}>
              {t('remove')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{b(level.name)}</div>
        <h1 className="display">{t('navMaterials')}</h1>
        <p className="small muted" style={{ marginBottom: 0 }}>{t('materialsLede')}</p>
      </div>

      <div className="row">
        {shelves.map((s) => (
          <button
            key={s.paper.id}
            type="button"
            className={`btn btn-sm${s.paper.id === openPaper ? ' btn-primary' : ''}`}
            aria-pressed={s.paper.id === openPaper}
            onClick={() => {
              setPaperId(s.paper.id);
              setPending(null);
              show(null);
            }}
          >
            {b(s.paper.name).split('—')[0].trim()}
            {s.items.length > 0 && <span className="material-count"> · {n(s.items.length)}</span>}
          </button>
        ))}
      </div>

      {!storable && (
        <div className="notice tone-warn">
          <div className="small">{t('materialsUnavailable')}</div>
        </div>
      )}

      {message && (
        <div className="notice">
          <div className="small">{t(message)}</div>
        </div>
      )}

      {preview && (
        <div className="card">
          <div className="between" style={{ alignItems: 'flex-start', gap: 10 }}>
            <h2 style={{ marginBottom: 0, fontSize: '1rem' }}>{preview.title}</h2>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setPreview(null)}>
              {t('closePreview')}
            </button>
          </div>
          <MaterialView
            key={preview.id}
            url={preview.url}
            title={preview.title}
            kind={preview.kind}
            contents={MATERIAL_CONTENTS[preview.fileName]}
          />
          <div className="row" style={{ marginTop: 10 }}>
            <a className="btn btn-sm btn-primary" href={preview.url} target="_blank" rel="noreferrer">
              {t('openInNewTab')}
            </a>
            <button
              type="button"
              className="btn btn-sm"
              disabled={busy}
              onClick={() => void saveStamped(preview)}
            >
              {busy ? t('materialStamping') : `${t('saveCopy')} · ${WATERMARK_TEXT}`}
            </button>
          </div>
          <p className="tiny muted" style={{ marginTop: 6, marginBottom: 0 }}>
            {t('materialStampNote')}
          </p>
        </div>
      )}

      {current && (
        <>
          <section className="stack">
            <div className="eyebrow">{b(current.paper.name)}</div>
            {current.items.length === 0 && <Empty icon="📄">{t('noMaterialsYet')}</Empty>}

            {current.sections.map((s) =>
              s.items.length === 0 ? null : (
                <section key={s.section.id}>
                  <div className="eyebrow">{b(s.section.name)}</div>
                  {s.topics.map((entry) => (
                    <div key={entry.topic.id} className="material-topic">
                      <div className="tiny muted material-topic-name">{b(entry.topic.text)}</div>
                      <div className="stack">{entry.items.map(card)}</div>
                    </div>
                  ))}
                  {s.untopiced.length > 0 && (
                    <div className="stack" style={{ marginTop: s.topics.length > 0 ? 12 : 0 }}>
                      {s.untopiced.map(card)}
                    </div>
                  )}
                </section>
              ),
            )}

            {current.general.length > 0 && (
              <section>
                <div className="eyebrow">{t('wholePaper')}</div>
                <div className="stack">{current.general.map(card)}</div>
              </section>
            )}
          </section>

          <div className="card">
            <div className="between">
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{t('publishTitle')}</strong>
                <div className="tiny muted">{t('publishLede')}</div>
              </div>
              <Link className="btn btn-sm" to="/publish">{t('openMaterial')}</Link>
            </div>
          </div>

          {storable && (
            <div className="card">
              <h2 style={{ fontSize: '1rem' }}>{t('addMaterial')}</h2>
              <label className="btn btn-sm file-label" style={{ marginTop: 4 }}>
                {t('chooseFile')}
                <input
                  ref={fileInput}
                  className="file-input"
                  type="file"
                  accept={ACCEPTED_TYPES}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void chooseFile(file);
                  }}
                />
              </label>

              {pending && (
                <div className="stack" style={{ marginTop: 12 }}>
                  <div>
                    <label className="tiny muted" htmlFor="material-title">{t('materialTitle')}</label>
                    <input
                      id="material-title"
                      className="input"
                      value={pending.title}
                      onChange={(e) => setPending({ ...pending, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="tiny muted" htmlFor="material-section">{t('fileUnder')}</label>
                    <select
                      id="material-section"
                      className="input"
                      value={pending.sectionId}
                      onChange={(e) =>
                        // Changing the section invalidates the topic under it.
                        setPending({ ...pending, sectionId: e.target.value, topicId: '' })
                      }
                    >
                      <option value="">{t('wholePaper')}</option>
                      {current.paper.sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {b(s.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {pending.sectionId && (
                    <div>
                      <label className="tiny muted" htmlFor="material-topic">{t('materialTopic')}</label>
                      <select
                        id="material-topic"
                        className="input"
                        value={pending.topicId}
                        onChange={(e) => setPending({ ...pending, topicId: e.target.value })}
                      >
                        <option value="">{t('materialWholeSection')}</option>
                        {topicsOf(
                          current.paper.sections.find((s) => s.id === pending.sectionId)!,
                        ).map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {b(topic.text)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="row">
                    <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void fileIt()}>
                      {t('addToShelf')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setPending(null);
                        if (fileInput.current) fileInput.current.value = '';
                      }}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                  <div className="tiny muted">
                    {pending.file.name} · {n(formatBytes(pending.file.size))}
                  </div>
                </div>
              )}

              <div className="tiny muted" style={{ marginTop: 12 }}>
                {t('materialRights')}
                {held > 0 && ` · ${n(formatBytes(held))} ${t('onThisDevice')}`}
              </div>
            </div>
          )}
        </>
      )}

      {strays.length > 0 && (
        <section>
          <div className="eyebrow">{t('materialsFromOldSyllabus')}</div>
          <div className="stack">{strays.map(card)}</div>
        </section>
      )}
    </div>
  );
}
