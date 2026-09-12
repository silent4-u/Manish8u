import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';

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
 * One page is on screen at a time on purpose. A 65-page booklet held as
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

interface Props {
  /** Path or object URL of the file to show. */
  url: string;
  /** Shown above the page, and used as the canvas label. */
  title: string;
}

export function PdfPreview({ url, title }: Props) {
  const { t, n } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<{ destroy(): Promise<void> } | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(0);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  // One document per file. Opening another closes this one, so a candidate
  // flipping between booklets does not leave workers running behind them.
  useEffect(() => {
    let live = true;
    setState('loading');
    setPageCount(0);
    setPage(1);
    setZoom(0);

    void (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const doc = await pdfjs.getDocument({ url, isEvalSupported: false }).promise;
        if (!live) {
          void doc.destroy();
          return;
        }
        docRef.current = doc;
        setPageCount(doc.numPages);
        setState('ready');
      } catch {
        if (live) setState('failed');
      }
    })();

    return () => {
      live = false;
      void docRef.current?.destroy();
      docRef.current = null;
    };
  }, [url]);

  const draw = useCallback(async () => {
    const doc = docRef.current as Awaited<ReturnType<PdfModule['getDocument']>['promise']> | null;
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
  }, [page, zoom]);

  useEffect(() => {
    if (state !== 'ready') return;
    void draw();
    // Rotating a phone changes the column width, so the page is redrawn to it.
    const onResize = () => void draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [state, draw]);

  if (state === 'failed') {
    return (
      <p className="small muted" style={{ marginBottom: 0 }}>
        {t('pdfFailed')}
      </p>
    );
  }

  const step = (by: number) => setPage((p) => Math.min(Math.max(p + by, 1), pageCount || 1));

  return (
    <div ref={frameRef}>
      <div className="pdf-sheet">
        <canvas ref={canvasRef} aria-label={title} />
        {state === 'loading' && <p className="small muted center pdf-sheet-note">{t('pdfLoading')}</p>}
      </div>

      <div className="row between pdf-pager">
        {pageCount > 1 ? (
          <button type="button" className="btn btn-sm" onClick={() => step(-1)} disabled={page <= 1}>
            ← {t('previous')}
          </button>
        ) : (
          <span />
        )}
        <span className="small muted mono-num">
          {pageCount > 1 && `${t('pdfPage')} ${n(page)} / ${n(pageCount)}`}
        </span>
        {pageCount > 1 ? (
          <button type="button" className="btn btn-sm" onClick={() => step(1)} disabled={page >= pageCount}>
            {t('next')} →
          </button>
        ) : (
          <span />
        )}
      </div>

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
    </div>
  );
}
