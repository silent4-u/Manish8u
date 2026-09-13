/*
 * Checks on the watermark.
 *
 * The drawing itself needs a canvas or a PDF, so what is tested here is the
 * part that decides where the marks go and what the saved file is called —
 * which is the part that can silently stop covering a page.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { STAMP_MARK, WATERMARK_TEXT, isStampableImage, stampGrid, stampedName } from '../src/lib/watermark';
import { CATALOGUE_ENTRIES } from '../src/data/materials';
import { kindOf, rejectReason, hasImageHeader, headerMatches } from '../src/lib/materials';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}\n        expected ${e}\n        actual   ${a}`);
  }
}

console.log('stampGrid');
const a4 = stampGrid(595, 842, WATERMARK_TEXT.length);
check('an A4 page gets more than one mark', a4.length > 1, true);
check('marks are sized to the page', a4[0].size > 12 && a4[0].size < 60, true);
check(
  'the grid starts left of the page so tiling reaches the edge',
  a4.some((m) => m.x < 0),
  true,
);
check(
  'the grid runs past the bottom so the last row is not clipped short',
  a4.some((m) => m.y > 842 * 0.8),
  true,
);
// A page with no marks on it is a page that went out unmarked.
for (const [w, h, label] of [
  [595, 842, 'A4 portrait'],
  [842, 595, 'A4 landscape'],
  [200, 200, 'a small square'],
  [4000, 3000, 'a large photo'],
] as [number, number, string][]) {
  check(`${label} is covered`, stampGrid(w, h, WATERMARK_TEXT.length).length > 0, true);
}

console.log('\nstampedName');
check('keeps the extension', stampedName('notes.pdf'), 'notes-circulartriangle.pdf');
check('handles a name with dots', stampedName('gk.01.notes.pdf'), 'gk.01.notes-circulartriangle.pdf');
check('handles no extension', stampedName('notes'), 'notes-circulartriangle');
check('a leading dot is not an extension', stampedName('.hidden'), '.hidden-circulartriangle');

console.log('\nwhat the shelf accepts');
check('a pdf', kindOf({ name: 'a.pdf', size: 10, type: 'application/pdf' }), 'pdf');
check('a photo from a phone', kindOf({ name: 'IMG_0001.JPG', size: 10, type: 'image/jpeg' }), 'image');
check('a png with no mime type', kindOf({ name: 'shot.png', size: 10, type: '' }), 'image');
check('a webp', kindOf({ name: 'x.webp', size: 10, type: 'image/webp' }), 'image');
check('a word document is refused', kindOf({ name: 'a.docx', size: 10, type: '' }), null);
check(
  'and refused with a reason the app can show',
  rejectReason({ name: 'a.docx', size: 10, type: '' }),
  'unsupported-type',
);
check('an empty file is refused first', rejectReason({ name: 'a.pdf', size: 0, type: 'application/pdf' }), 'empty');
check('isStampableImage agrees with kindOf', isStampableImage('image/png', 'a.png'), true);
check('isStampableImage rejects a pdf', isStampableImage('application/pdf', 'a.pdf'), false);

console.log('\nheader checks');
check('png magic', hasImageHeader(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d])), true);
check('jpeg magic', hasImageHeader(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), true);
check('a pdf is not an image', hasImageHeader(new Uint8Array([0x25, 0x50, 0x44, 0x46])), false);
check(
  'a pdf renamed to .png is caught',
  headerMatches('image', new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])),
  false,
);

console.log('\nevery published PDF carries the mark');
const published = [...new Set(CATALOGUE_ENTRIES.map((e) => e.file))]
  .filter((file) => extname(file).toLowerCase() === '.pdf')
  .sort();
let stamped = 0;
for (const file of published) {
  const bytes = new Uint8Array(readFileSync(join(repoRoot, 'public/materials', file)));
  // eslint-disable-next-line no-await-in-loop
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const marked = doc.getSubject() === STAMP_MARK;
  if (marked) stamped += 1;
  else console.log(`  FAIL  ${file} ships unstamped — run npm run stamp:materials`);
}
check(`all ${published.length} published PDFs are stamped`, stamped, published.length);

console.log('\nno stray files in the shipped folder');
const shippedPdfs = readdirSync(join(repoRoot, 'public/materials'))
  .filter((name) => extname(name).toLowerCase() === '.pdf');
check('every shipped PDF is published by a catalogue entry', shippedPdfs.filter((f) => !published.includes(f)), []);

console.log(failures === 0 ? '\nAll watermark checks passed.' : `\n${failures} watermark check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
