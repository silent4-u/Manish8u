/*
 * Stamp the published materials before they ship.
 *
 * The app also stamps on the way out, but that only marks the copy a reader
 * saves — the file behind it is still served unmarked, and anyone who knows
 * the URL can fetch it clean. This pass rewrites the shipped bytes, so there
 * is no unstamped original to find in the first place.
 *
 *   npm run stamp:materials            # stamp anything not yet stamped
 *   npm run stamp:materials -- --check # fail if anything is unstamped (CI)
 *   npm run stamp:materials -- --force # restamp everything
 *
 * Originals are kept in `materials-source/`, which is not shipped, so a
 * restamp always works from a clean copy rather than stacking marks.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { STAMP_MARK, WATERMARK_TEXT, stampGrid } from '../src/lib/watermark';
import { CATALOGUE_ENTRIES } from '../src/data/materials';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const shipped = join(repoRoot, 'public/materials');
const sources = join(repoRoot, 'materials-source');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const force = args.has('--force');

async function stampedAlready(bytes: Uint8Array): Promise<boolean> {
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return doc.getSubject() === STAMP_MARK;
  } catch {
    return false;
  }
}

async function stamp(bytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    for (const mark of stampGrid(width, height, WATERMARK_TEXT.length)) {
      page.drawText(WATERMARK_TEXT, {
        x: mark.x,
        // The grid counts from the top; PDF space counts from the bottom.
        y: height - mark.y,
        size: mark.size,
        font,
        color: rgb(0, 0, 0),
        opacity: 0.18,
        rotate: degrees(-30),
      });
    }
  }
  doc.setSubject(STAMP_MARK);
  return doc.save();
}

const pdfs = [...new Set(CATALOGUE_ENTRIES.map((entry) => entry.file))]
  .filter((file) => extname(file).toLowerCase() === '.pdf')
  .sort();

if (!existsSync(sources)) mkdirSync(sources, { recursive: true });

const unstamped: string[] = [];
const done: string[] = [];
let failed = 0;

for (const file of pdfs) {
  const target = join(shipped, file);
  const original = join(sources, file);
  if (!existsSync(target)) {
    console.log(`  MISSING  ${file}`);
    failed += 1;
    continue;
  }

  // First sight of a file: keep the untouched original before rewriting it.
  if (!existsSync(original)) copyFileSync(target, original);

  const current = new Uint8Array(readFileSync(target));
  const already = await stampedAlready(current);

  if (already && !force) {
    done.push(file);
    console.log(`  ok       ${file}`);
    continue;
  }
  if (checkOnly) {
    unstamped.push(file);
    console.log(`  UNSTAMPED ${file}`);
    continue;
  }

  try {
    // Always stamp the pristine copy, so --force does not double-mark.
    const out = await stamp(new Uint8Array(readFileSync(original)));
    writeFileSync(target, out);
    done.push(file);
    const before = current.byteLength / 1024;
    const after = out.byteLength / 1024;
    console.log(`  stamped  ${file}  ${before.toFixed(0)} → ${after.toFixed(0)} KB`);
  } catch (error) {
    failed += 1;
    console.log(`  FAILED   ${file}: ${(error as Error).message}`);
  }
}

// Anything sitting in public/materials that no catalogue entry publishes.
const orphans = readdirSync(shipped)
  .filter((name) => extname(name).toLowerCase() === '.pdf')
  .filter((name) => !pdfs.includes(name));
for (const orphan of orphans) console.log(`  ORPHAN   ${orphan} — in the folder but no catalogue entry publishes it`);

console.log('\n---');
console.log(`${done.length} of ${pdfs.length} published PDF(s) carry the ${WATERMARK_TEXT} watermark.`);
if (unstamped.length > 0) {
  console.log(`\n${unstamped.length} unstamped. Run \`npm run stamp:materials\` before shipping:`);
  for (const file of unstamped) console.log(`  - ${file}`);
}
if (orphans.length > 0) console.log(`${orphans.length} file(s) in public/materials are not published by any catalogue entry.`);

process.exit(failed > 0 || unstamped.length > 0 ? 1 : 0);
