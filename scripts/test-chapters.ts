/*
 * Pin the chapter indexes to the documents they were read from. Run with
 * `npm run test:chapters`.
 *
 * `src/data/materialChapters.ts` is written by hand, and for the twelve Nepali
 * booklets it had to be: their Devanagari is set in a legacy font whose text
 * layer is lossy — it runs words together, substitutes letters and sometimes
 * inserts them — so the titles were read off the rendered page rather than
 * copied out of the file. What the text layer *can* still say exactly is where
 * each heading sits, and that is what this checks: the marked headings in each
 * file, page by page, must still line up one-for-one with the entries derived
 * from them.
 *
 * That catches the failure this data is prone to — an entry pointing at the
 * wrong page, a heading appearing or disappearing when a file is re-exported,
 * a row added or dropped by hand — all of which shift the sequence.
 *
 * It does not check spelling. Comparing a title against its own heading was
 * tried and does not work: with this font a correct short title can align
 * poorly with its own mangled heading while matching a sibling closely
 * ("मेचे जाति" resembles "माझी जाति" more than it resembles its own line), so
 * no threshold separates a real entry from a wrong one. Spelling was verified
 * instead by reading each heading off the rendered page, and re-reading the
 * doubtful ones at high magnification.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MATERIAL_CONTENTS } from '../src/data/materialChapters';

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
const materialsDir = join(dirname(fileURLToPath(import.meta.url)), '../public/materials');

/** The glyphs these documents put in front of a heading. */
const DIAMOND = 0xf076;
const BULLET = 0xf0b7;

interface Source {
  /** Which marker the index was read from. */
  marker: 'diamond' | 'jati';
  /**
   * Pages of entries that came from somewhere other than that marker: a
   * chapter title the booklet sets larger and centred, or — in gk-09, whose
   * diamonds do not start until page 6 and skip pages 19 to 29 — a section
   * heading taken from the outermost bullet indent. In page order.
   */
  extra?: number[];
  /** Pages of marked headings deliberately left out of the index, in order. */
  dropped?: number[];
}

const SOURCES: Record<string, Source> = {
  'gk-01-universe-and-solar-system.pdf': { marker: 'diamond', extra: [1, 2, 9] },
  'gk-02-geography-of-nepal.pdf': { marker: 'diamond' },
  'gk-03-world-history.pdf': { marker: 'diamond' },
  'gk-04-history-of-nepal.pdf': { marker: 'diamond' },
  'gk-05-constitutional-and-administrative-history.pdf': { marker: 'diamond' },
  'gk-06-religion-and-culture.pdf': { marker: 'diamond' },
  /*
   * gk-07's diamond-marked language tables mostly lost their name to a font
   * the text layer cannot map at all, so its index is the round bullet it
   * puts in front of each ethnic group instead. The last three of those are
   * cells in a table of further groups on page 34, which the diamond heading
   * above that table covers in one row.
   */
  'gk-07-ethnic-groups-and-languages.pdf': { marker: 'jati', extra: [34], dropped: [34, 34, 34] },
  'gk-08-agriculture-and-irrigation.pdf': { marker: 'diamond', extra: [1, 8, 16, 18, 20, 20] },
  'gk-09-development-infrastructure.pdf': {
    marker: 'diamond',
    extra: [1, 2, 2, 3, 4, 4, 4, 5, 5, 5, 9, 14, 17, 18, 18, 19, 19, 19, 27, 28, 28, 29, 29],
  },
  'gk-10-science-technology-and-health.pdf': { marker: 'diamond' },
  'gk-11-ecosystem-and-environment.pdf': { marker: 'diamond' },
  /*
   * The twelve month headings on page 63 all open the same page as the
   * "International/ World Days" heading above them, so indexing them would
   * add twelve rows that all go to the same place.
   */
  'gk-12-international-relations.pdf': {
    marker: 'diamond',
    extra: [61, 62],
    dropped: [63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63],
  },
};

/** Every marked heading in a file, in the order a reader meets them. */
async function markedPages(file: string, marker: 'diamond' | 'jati'): Promise<number[]> {
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(readFileSync(file)),
    useSystemFonts: false,
  }).promise;
  const glyph = marker === 'jati' ? BULLET : DIAMOND;
  const found: { page: number; y: number; x: number }[] = [];

  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const width = page.getViewport({ scale: 1 }).width;
    const { items } = await page.getTextContent();
    const cells = (items as { str: string; transform: number[] }[])
      .filter((it) => it.str && it.str.trim())
      .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }));

    for (const m of cells.filter((c) => (c.str.codePointAt(0) ?? 0) === glyph)) {
      // Only what sits to the right of the marker, up to the next one.
      // Grouping by baseline instead would merge the two columns some pages
      // use, hiding a right-column heading behind a left-column one.
      const rest = cells.filter((c) => Math.abs(c.y - m.y) <= 2 && c.x > m.x).sort((a, b) => a.x - b.x);
      const next = rest.find((c) => (c.str.codePointAt(0) ?? 0) === glyph);
      const text = rest.filter((c) => c.x < (next ? next.x : width)).map((c) => c.str).join('').trim();
      // gk-07's index is the groups, not every bullet in the booklet.
      if (marker === 'jati' && !/जातत|जतत/.test(text)) continue;
      found.push({ page: p, y: m.y, x: m.x });
    }
  }
  await doc.destroy();
  found.sort((a, b) => a.page - b.page || b.y - a.y || a.x - b.x);
  return found.map((f) => f.page);
}

/** Remove each page in `dropped` once, from the end, as the index did. */
function withoutDropped(pages: number[], dropped: number[]): number[] {
  const out = [...pages];
  for (const page of [...dropped].reverse()) {
    const at = out.lastIndexOf(page);
    if (at >= 0) out.splice(at, 1);
  }
  return out;
}

let failures = 0;

for (const [fileName, source] of Object.entries(SOURCES)) {
  const path = join(materialsDir, fileName);
  const contents = MATERIAL_CONTENTS[fileName];
  if (!existsSync(path) || !contents) {
    console.error(`  FAIL  ${fileName} is missing from public/materials or from MATERIAL_CONTENTS`);
    failures += 1;
    continue;
  }

  const marked = withoutDropped(await markedPages(path, source.marker), source.dropped ?? []);
  const expected = [...marked, ...(source.extra ?? [])].sort((a, b) => a - b);
  const actual = contents.chapters.map((c) => c.page).slice().sort((a, b) => a - b);

  if (expected.length !== actual.length || expected.some((p, i) => p !== actual[i])) {
    failures += 1;
    const firstDiff = expected.findIndex((p, i) => p !== actual[i]);
    console.error(
      `  FAIL  ${fileName}: the index no longer matches the headings in the file` +
        `\n        ${marked.length} marked heading(s) + ${(source.extra ?? []).length} other row(s)` +
        ` = ${expected.length} expected, index has ${actual.length}` +
        (firstDiff >= 0 ? `\n        first difference at position ${firstDiff + 1}: expected p${expected[firstDiff]}, index has p${actual[firstDiff]}` : ''),
    );
    continue;
  }
  console.log(`  ok    ${fileName} — ${actual.length} rows still line up with the file`);
}

const unpinned = Object.keys(MATERIAL_CONTENTS).filter((f) => f.startsWith('gk-') && !SOURCES[f]);
if (unpinned.length > 0) {
  failures += 1;
  console.error(`  FAIL  indexed but not pinned to a source: ${unpinned.join(', ')}`);
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nEvery Nepali chapter index still lines up with its document.');
