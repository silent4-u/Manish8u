/**
 * Unit checks for the material shelf. Run with `npm run test:materials`.
 *
 * The filing checks run against the real syllabus rather than a fixture, so a
 * paper that is renumbered in a future revision shows up here as a failure
 * instead of quietly stranding whatever a candidate filed under it.
 */
import { LEVEL_BY_ID } from '../src/data/levels';
import {
  defaultTitle,
  formatBytes,
  hasPdfHeader,
  rejectReason,
  shelfBytes,
  shelvesFor,
  unfiledFor,
  MAX_MATERIAL_BYTES,
  type MaterialMeta,
} from '../src/lib/materials';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}\n        expected ${e}\n        actual   ${a}`);
  }
}

console.log('rejectReason');
check('a real PDF is accepted', rejectReason({ name: 'notes.pdf', size: 2048, type: 'application/pdf' }), null);
check(
  'a .PDF with no MIME type still passes',
  rejectReason({ name: 'NOTES.PDF', size: 2048, type: '' }),
  null,
);
check(
  'anything else is refused',
  rejectReason({ name: 'notes.docx', size: 2048, type: 'application/msword' }),
  'not-pdf',
);
check('an empty file is refused', rejectReason({ name: 'a.pdf', size: 0, type: 'application/pdf' }), 'empty');
check(
  'the size limit is enforced',
  rejectReason({ name: 'a.pdf', size: MAX_MATERIAL_BYTES + 1, type: 'application/pdf' }),
  'too-large',
);
check(
  'a file exactly at the limit is allowed',
  rejectReason({ name: 'a.pdf', size: MAX_MATERIAL_BYTES, type: 'application/pdf' }),
  null,
);

console.log('hasPdfHeader');
const header = (offset: number, length = 2048) => {
  const bytes = new Uint8Array(length);
  bytes.set([0x25, 0x50, 0x44, 0x46, 0x2d], offset);
  return bytes;
};
check('header at the start', hasPdfHeader(header(0)), true);
check('header a little way in', hasPdfHeader(header(300)), true);
check('header at the last scanned offset', hasPdfHeader(header(1019)), true);
check('header past the scanned kilobyte', hasPdfHeader(header(1100)), false);
check('no header at all', hasPdfHeader(new Uint8Array(2048)), false);
check('a buffer too short to hold one', hasPdfHeader(new Uint8Array([0x25, 0x50])), false);
check('a renamed image is caught', hasPdfHeader(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])), false);

console.log('defaultTitle');
check('drops the extension', defaultTitle('revenue-administration.pdf'), 'revenue-administration');
check('underscores become spaces', defaultTitle('Public_Management_Notes.pdf'), 'Public Management Notes');
check('keeps a Nepali name intact', defaultTitle('राजस्व प्रशासन.pdf'), 'राजस्व प्रशासन');
check('a name with no extension survives', defaultTitle('notes'), 'notes');
check('a long name is trimmed', defaultTitle(`${'a'.repeat(120)}.pdf`), `${'a'.repeat(79)}…`);
check('a dotfile keeps its name', defaultTitle('.pdf'), '.pdf');

console.log('formatBytes');
check('kilobytes', formatBytes(4096), '4 KB');
check('rounds up to at least one kilobyte', formatBytes(12), '1 KB');
check('megabytes carry one decimal', formatBytes(2_500_000), '2.4 MB');
check('zero', formatBytes(0), '0 KB');
check('nonsense does not print NaN', formatBytes(Number.NaN), '0 KB');

console.log('shelvesFor');
const officer = LEVEL_BY_ID.adhikrit;
const paper4 = officer.papers[3];
const revenue = paper4.sections[1];

function meta(over: Partial<MaterialMeta> & Pick<MaterialMeta, 'id'>): MaterialMeta {
  return {
    origin: 'shelf',
    levelId: 'adhikrit',
    paperId: paper4.id,
    sectionId: null,
    title: over.id,
    fileName: `${over.id}.pdf`,
    size: 1024,
    addedAt: 1,
    ...over,
  };
}

const filed: MaterialMeta[] = [
  meta({ id: 'old', addedAt: 10 }),
  meta({ id: 'new', addedAt: 20 }),
  meta({ id: 'revenue', sectionId: revenue.id, addedAt: 15 }),
  meta({ id: 'paper1', paperId: officer.papers[0].id, addedAt: 5 }),
  meta({ id: 'ghost-section', sectionId: 'no-such-section', addedAt: 1 }),
  meta({ id: 'other-exam', levelId: 'kharidar', addedAt: 99 }),
  meta({ id: 'stale-paper', paperId: 'adhikrit-p9', addedAt: 7 }),
];

const shelves = shelvesFor(officer, filed);
check('one shelf per paper', shelves.length, officer.papers.length);
check(
  'each material lands under its own paper',
  shelves.map((s) => s.items.map((i) => i.id)),
  [['paper1'], [], [], ['new', 'revenue', 'old', 'ghost-section']],
);
check(
  'a sectioned material sits under that section',
  shelves[3].sections.map((s) => s.items.map((i) => i.id)),
  [[], ['revenue'], [], []],
);
check(
  'the rest sit under the paper as a whole, newest first',
  shelves[3].general.map((i) => i.id),
  ['new', 'old', 'ghost-section'],
);
check('another exam is not shown', shelves.every((s) => s.items.every((i) => i.levelId === 'adhikrit')), true);

console.log('unfiledFor');
check('a stale paper id is not lost', unfiledFor(officer, filed).map((i) => i.id), ['stale-paper']);
check('a level with everything filed has no strays', unfiledFor(officer, [meta({ id: 'ok' })]), []);

console.log('shelfBytes');
check('sums this level only', shelfBytes('adhikrit', filed), 6 * 1024);
check(
  'material published with the app is not counted against the device',
  shelfBytes('adhikrit', [meta({ id: 'p', origin: 'catalogue', size: 5000 })]),
  0,
);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll material checks passed.');
