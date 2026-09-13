/**
 * Stamping a downloaded file with the publisher's mark.
 *
 * What this does and does not do, stated plainly because it is easy to
 * mistake one for the other: a watermark applied here marks a copy as
 * having come from this app. It does not prevent copying. Anyone who can
 * open a published file can fetch the unstamped original from its URL, and
 * a stamp drawn over a page can be cropped or painted out. It is a claim of
 * origin and a deterrent, not access control.
 *
 * Where it matters, stamp at publish time instead — `npm run stamp:materials`
 * rewrites the file that ships, so the served bytes already carry the mark and
 * there is no unstamped original to find.
 */

/** The mark every downloaded copy carries. */
export const WATERMARK_TEXT = 'CircularTriangle';

/**
 * Written into a stamped PDF's Subject so a second pass can tell it is done.
 * Files the app ships are stamped at publish time, so without this a reader's
 * download would lay an identical grid over the existing one — twice the work
 * for a page that is merely darker.
 */
export const STAMP_MARK = `Watermarked: ${WATERMARK_TEXT}`;

export interface StampOptions {
  /** Text to tile across the page. Defaults to the publisher's mark. */
  text?: string;
  /**
   * Ink strength, 0 to 1. Low enough to read the page through, high enough
   * that removing it takes deliberate effort rather than a brightness slider.
   */
  opacity?: number;
  /** Degrees the text is rotated by. A diagonal is harder to crop out. */
  angle?: number;
}

const DEFAULTS = { text: WATERMARK_TEXT, opacity: 0.18, angle: -30 } as const;

/**
 * Where each mark is drawn on a page of the given size.
 *
 * Split out from the drawing so the placement can be tested without a canvas
 * or a PDF: the same grid drives both the image and the PDF path, which is
 * what keeps a stamped JPEG and a stamped PDF looking like the same product.
 */
export function stampGrid(
  width: number,
  height: number,
  textLength: number,
): { x: number; y: number; size: number }[] {
  // Scale with the page, so an A4 sheet and a phone photo both get a mark
  // that reads at a glance without swamping the content.
  const size = Math.max(12, Math.min(width, height) / 18);
  const stepX = Math.max(size * textLength * 0.62, width / 3);
  const stepY = Math.max(size * 4, height / 5);
  const marks: { x: number; y: number; size: number }[] = [];
  // Start off-page so the tiling reaches the edges rather than stopping short.
  for (let y = stepY / 2; y < height + stepY; y += stepY) {
    for (let x = -stepX / 2; x < width + stepX; x += stepX) {
      marks.push({ x, y, size });
    }
  }
  return marks;
}

/** A stamped file's name, keeping the extension where there is one. */
export function stampedName(fileName: string, mark = WATERMARK_TEXT): string {
  const slug = mark.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dot = fileName.lastIndexOf('.');
  if (dot <= 0) return `${fileName}-${slug}`;
  return `${fileName.slice(0, dot)}-${slug}${fileName.slice(dot)}`;
}

/** True for the image types the shelf accepts and can stamp. */
export function isStampableImage(type: string, name: string): boolean {
  return /^image\/(png|jpeg|jpg|webp)$/i.test(type) || /\.(png|jpe?g|webp)$/i.test(name);
}

/**
 * Draw the tiled mark onto a 2D context already holding the page.
 *
 * Exported so both the download path and the in-app preview can use it and
 * cannot drift apart.
 */
export function paintWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: StampOptions = {},
): void {
  const { text, opacity, angle } = { ...DEFAULTS, ...options };
  context.save();
  context.globalAlpha = opacity;
  context.fillStyle = '#000';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const mark of stampGrid(width, height, text.length)) {
    context.save();
    context.translate(mark.x, mark.y);
    context.rotate((angle * Math.PI) / 180);
    context.font = `600 ${mark.size}px system-ui, sans-serif`;
    // A light outline keeps the mark legible over dark photographs, where
    // black-on-black would otherwise disappear entirely.
    context.strokeStyle = 'rgba(255,255,255,0.5)';
    context.lineWidth = Math.max(1, mark.size / 14);
    context.strokeText(text, 0, 0);
    context.fillText(text, 0, 0);
    context.restore();
  }
  context.restore();
}

/** Stamp an image and return it as a new blob. Browser only. */
export async function stampImage(source: Blob, options: StampOptions = {}): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no 2d context');
    context.drawImage(bitmap, 0, 0);
    paintWatermark(context, canvas.width, canvas.height, options);
    const stamped = await new Promise<Blob | null>((resolve) =>
      // PNG keeps text edges crisp; a re-encoded JPEG would soften the mark
      // and the scan underneath it at the same time.
      canvas.toBlob(resolve, 'image/png'),
    );
    if (!stamped) throw new Error('canvas produced no blob');
    return stamped;
  } finally {
    bitmap.close();
  }
}

/**
 * Stamp every page of a PDF and return the new bytes.
 *
 * pdf-lib is half a megabyte, so it loads only when someone actually asks for
 * a stamped download — the same treatment pdf.js gets for reading.
 */
export async function stampPdf(source: ArrayBuffer, options: StampOptions = {}): Promise<Uint8Array> {
  const { text, opacity, angle } = { ...DEFAULTS, ...options };
  const { PDFDocument, StandardFonts, degrees, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.load(source, { ignoreEncryption: true });

  // Already stamped at publish time: hand back the bytes as they are.
  if (doc.getSubject() === STAMP_MARK) return new Uint8Array(source);

  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    for (const mark of stampGrid(width, height, text.length)) {
      page.drawText(text, {
        // PDF's origin is bottom-left and the grid counts from the top.
        x: mark.x,
        y: height - mark.y,
        size: mark.size,
        font,
        color: rgb(0, 0, 0),
        opacity,
        rotate: degrees(angle),
      });
    }
  }
  doc.setSubject(STAMP_MARK);
  return doc.save();
}
