import { useCallback, useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useLang } from '../i18n/LanguageContext';
import type { MaterialContents } from '../lib/materials';

/**
 * Renders a PDF page by page, in the app itself.
 *
 * The obvious markup — `<object type="application/pdf">` — leans on a viewer
 * the host has to provide, and two of the three places this app runs do not
 * provide one: an Android WebView ships no PDF viewer at all, and a sandboxed
 * preview frame blocks the plugin. Both showed a candidate an empty box where
 * their study notes should be. Drawing the pages ourselves works everywhere
 * the app runs, offline included, and leaves the file itself untouched.
 *
 * One page is on screen at a time on purpose. A 90-page booklet held as
 * canvases at phone resolution runs to hundreds of megabytes, so the viewer
 * keeps exactly one and repaints it on every move.
 */

/** pdf.js is a megabyte and a half; it loads when a file is first opened. */
type PdfModule = typeof import('pdfjs-dist');
let pdfjsPromise: Promise<PdfModule> | null = null;

function loadPdfjs(): Promise<PdfModule> {
  pdfjsPromise ??= (async () => {
    const [pdfjs, workerUrl] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((m) => m.default),
    ]);
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    return pdfjs;
  })();
  return pdfjsPromise;
}

/** Cap the backing store so a wide desktop window cannot allocate a huge canvas. */
const MAX_CANVAS_WIDTH = 2400;

/**
 * Zoom steps, as a multiple of the column width. These booklets are dense A4
 * sheets, so on a phone the whole page fits but its body text does not read —
 * 1 is for finding your place, the rest are for actually reading.
 */
const ZOOMS = [1, 1.5, 2, 3];

/** Backing width of a contents thumbnail. Small enough that a 90-page grid fits. */
const THUMB_WIDTH = 150;

interface Props {
  /** Path or object URL of the file to show. */
  url: string;
  /** Shown above the page, and used as the canvas label. */
  title: string;
  /** Chapter index, when the file's headings could be read. */
  contents?: MaterialContents;
}

export function PdfPreview({ url, title, contents }: Props) {
  const { t, n } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(0);
  const [browsing, setBrowsing] = useState(false);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  // One document per file. Opening another closes this one, so a candidate
  // flipping between booklets does not leave workers running behind them.
  useEffect(() => {
    let live = true;
    setState('loading');
    setDoc(null);
    setPage(1);
    setZoom(0);
    setBrowsing(false);
    let opened: PDFDocumentProxy | null = null;

    void (async () => {
      try {
        const pdfjs = await loadPdfjs();
        opened = await pdfjs.getDocument({ url, isEvalSupported: false }).promise;
        if (!live) {
          void opened.destroy();
          return;
        }
        setDoc(opened);
        setState('ready');
      } catch {
        if (live) setState('failed');
      }
    })();

    return () => {
      live = false;
      void opened?.destroy();
    };
  }, [url]);

  const pageCount = doc?.numPages ?? 0;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!doc || !canvas || !frame) return;

    try {
      const sheet = await doc.getPage(page);
      const unscaled = sheet.getViewport({ scale: 1 });
      // Fit the page to the column and multiply by the zoom step, then draw at
      // device resolution so the Devanagari in these scans stays legible
      // rather than going soft.
      const factor = ZOOMS[zoom] ?? 1;
      const width = Math.min((frame.clientWidth || unscaled.width) * factor, MAX_CANVAS_WIDTH);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = sheet.getViewport({ scale: (width / unscaled.width) * ratio });
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${factor * 100}%`;
      canvas.style.aspectRatio = `${unscaled.width} / ${unscaled.height}`;
      await sheet.render({ canvasContext: context, viewport }).promise;
    } catch {
      setState('failed');
    }
  }, [doc, page, zoom]);

  useEffect(() => {
    if (state !== 'ready' || browsing) return;
    void draw();
    // Rotating a phone changes the column width, so the page is redrawn to it.
    const onResize = () => void draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [state, browsing, draw]);

  if (state === 'failed') {
    return (
      <p className="small muted" style={{ marginBottom: 0 }}>
        {t('pdfFailed')}
      </p>
    );
  }

  const step = (by: number) => setPage((p) => Math.min(Math.max(p + by, 1), pageCount || 1));
  const goTo = (target: number) => {
    setPage(Math.min(Math.max(target, 1), pageCount || 1));
    setZoom(0);
    setBrowsing(false);
  };

  return (
    <div ref={frameRef}>
      {pageCount > 1 && (
        <div className="row pdf-tools">
          <button
            type="button"
            className={`btn btn-sm${browsing ? ' btn-primary' : ''}`}
            aria-expanded={browsing}
            onClick={() => setBrowsing((open) => !open)}
          >
            ☰ {t('pdfContents')}
          </button>
          {contents && (
            <span className="tiny muted">
              {n(contents.chapters.length)} {t('pdfChapters')}
            </span>
          )}
        </div>
      )}

      {browsing ? (
        <div className="pdf-browse">
          {contents && (
            <ol className="pdf-chapters">
              {contents.chapters.map((chapter) => (
                <li key={`${chapter.level}-${chapter.title}`} className={`pdf-chapter lvl-${chapter.level}`}>
                  <button type="button" className="pdf-chapter-btn" onClick={() => goTo(chapter.page)}>
                    <span>{chapter.title}</span>
                    <span className="tiny muted mono-num">{n(chapter.page)}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
          <div className="eyebrow" style={{ marginTop: contents ? 16 : 0 }}>
            {t('pdfAllPages')}
          </div>
          {doc && <PdfThumbs doc={doc} current={page} onPick={goTo} />}
        </div>
      ) : (
        <>
          <div className="pdf-sheet">
            <canvas ref={canvasRef} aria-label={title} />
            {state === 'loading' && <p className="small muted center pdf-sheet-note">{t('pdfLoading')}</p>}
          </div>

          {pageCount > 1 && (
            <div className="row between pdf-pager">
              <button type="button" className="btn btn-sm" onClick={() => step(-1)} disabled={page <= 1}>
                ← {t('previous')}
              </button>
              <span className="small muted mono-num">
                {t('pdfPage')} {n(page)} / {n(pageCount)}
              </span>
              <button type="button" className="btn btn-sm" onClick={() => step(1)} disabled={page >= pageCount}>
                {t('next')} →
              </button>
            </div>
          )}

          <div className="row pdf-zoom">
            <span className="tiny muted">{t('pdfZoom')}</span>
            {ZOOMS.map((factor, i) => (
              <button
                key={factor}
                type="button"
                className={`btn btn-sm${i === zoom ? ' btn-primary' : ''}`}
                aria-pressed={i === zoom}
                onClick={() => setZoom(i)}
              >
                {i === 0 ? t('pdfFitWidth') : `${n(factor)}×`}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Every page as a thumbnail. This is the only navigation that works for the
 * booklets whose Devanagari is set in a legacy Preeti font: their text cannot
 * be read out of the file, but a candidate can see the headings and tap the
 * page. Thumbnails are drawn as they come into view, one at a time, so opening
 * a 90-page booklet does not render 90 pages at once.
 */
function PdfThumbs({
  doc,
  current,
  onPick,
}: {
  doc: PDFDocumentProxy;
  current: number;
  onPick: (page: number) => void;
}) {
  const { n } = useLang();
  const gridRef = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState<number[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.page))
          .filter((p) => p > 0);
        if (seen.length) setWanted((prev) => [...new Set([...prev, ...seen])]);
      },
      { root: grid, rootMargin: '200px' },
    );
    for (const cell of grid.querySelectorAll('[data-page]')) observer.observe(cell);
    return () => observer.disconnect();
  }, [doc]);

  return (
    <div className="pdf-thumbs" ref={gridRef}>
      {Array.from({ length: doc.numPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          data-page={p}
          className={`pdf-thumb${p === current ? ' current' : ''}`}
          onClick={() => onPick(p)}
        >
          <Thumb doc={doc} page={p} render={wanted.includes(p)} />
          <span className="tiny mono-num">{n(p)}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Thumbnail renders are serialised across the whole grid: pdf.js will happily
 * start fifty page renders at once and then deliver none of them promptly.
 */
let thumbQueue: Promise<unknown> = Promise.resolve();

function Thumb({ doc, page, render }: { doc: PDFDocumentProxy; page: number; render: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!render || drawn) return;
    let live = true;
    thumbQueue = thumbQueue.then(async () => {
      const canvas = ref.current;
      if (!live || !canvas) return;
      try {
        const sheet = await doc.getPage(page);
        const unscaled = sheet.getViewport({ scale: 1 });
        const viewport = sheet.getViewport({ scale: THUMB_WIDTH / unscaled.width });
        const context = canvas.getContext('2d');
        if (!context) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await sheet.render({ canvasContext: context, viewport }).promise;
        if (live) setDrawn(true);
      } catch {
        // A page that will not draw simply stays blank; its number still works.
      }
    });
    return () => {
      live = false;
    };
  }, [doc, page, render, drawn]);

  return <canvas ref={ref} className="pdf-thumb-art" />;
}
