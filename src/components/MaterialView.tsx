import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { PdfPreview } from './PdfPreview';
import type { MaterialContents, MaterialKind } from '../lib/materials';
import { WATERMARK_TEXT, paintWatermark } from '../lib/watermark';

/**
 * One material on screen, whichever kind it is.
 *
 * A PDF goes to the page renderer; a picture is drawn onto a canvas rather
 * than put in an `<img>`, so the same watermark that lands on a downloaded
 * copy is visible while reading. Showing an unmarked page and then handing
 * over a marked download would teach a reader that screenshotting the viewer
 * is the way to get a clean copy.
 */
interface Props {
  url: string;
  title: string;
  kind: MaterialKind;
  contents?: MaterialContents;
}

export function MaterialView({ url, title, kind, contents }: Props) {
  if (kind === 'pdf') return <PdfPreview url={url} title={title} contents={contents} />;
  return <ImageView url={url} title={title} />;
}

function ImageView({ url, title }: { url: string; title: string }) {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let live = true;
    setState('loading');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (!live) return;
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) {
        setState('failed');
        return;
      }
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      paintWatermark(context, canvas.width, canvas.height);
      setState('ready');
    };
    image.onerror = () => {
      if (live) setState('failed');
    };
    image.src = url;
    return () => {
      live = false;
    };
  }, [url]);

  if (state === 'failed') {
    return (
      <p className="small muted" style={{ marginBottom: 0 }}>
        {t('pdfFailed')}
      </p>
    );
  }

  return (
    <div>
      <div className="pdf-sheet material-photo">
        <canvas ref={canvasRef} aria-label={title} />
        {state === 'loading' && <p className="small muted center pdf-sheet-note">{t('pdfLoading')}</p>}
      </div>
      <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>
        {t('watermarkedWith')}: {WATERMARK_TEXT}
      </p>
    </div>
  );
}
