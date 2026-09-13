/*
 * Checks on the published library.
 *
 * The parts that matter here are not the happy path — they are the ways this
 * could quietly ship something dangerous: a service-role key in the bundle, a
 * credential in a commit, or a build that silently falls back to the
 * browser-only preview while the owner believes they are publishing to
 * customers.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { asMaterialMeta } from '../src/lib/library';
import type { RemoteMaterial } from '../src/lib/library';

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

console.log('no credentials can reach a commit');
const ignored = execFileSync('git', ['check-ignore', '.env', '.env.local'], {
  cwd: repoRoot,
  encoding: 'utf8',
}).trim().split('\n');
check('.env is gitignored', ignored.includes('.env'), true);
check('.env.local is gitignored', ignored.includes('.env.local'), true);

/*
 * A service-role key bypasses every policy at the provider, so no code may
 * read one. Warning about it in a comment is the desired state, not a
 * violation — so comments are stripped before looking, and the check is for
 * code that would actually use such a key.
 */
const sources: string[] = [];
function walk(dir: string) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'materials-source'].includes(name.name)) continue;
    const full = join(dir, name.name);
    if (name.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|mjs)$/.test(name.name)) sources.push(full);
  }
}
walk(repoRoot);

function withoutComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

// This file is the one place the pattern legitimately appears in code.
const scanned = sources.filter((file) => !file.endsWith('scripts/test-library.ts'));
const usingServiceRole = scanned
  .filter((file) => /service[_-]?role/i.test(withoutComments(readFileSync(file, 'utf8'))))
  .map((f) => f.replace(`${repoRoot}/`, ''));
check('no code reads a service-role key', usingServiceRole, []);

// The strongest check available without the provider: a Supabase key is a
// JWT, so any JWT in tracked source is a credential that escaped.
const jwts = sources
  .filter((file) => /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/.test(readFileSync(file, 'utf8')))
  .map((f) => f.replace(`${repoRoot}/`, ''));
check('no JWT is committed anywhere in source', jwts, []);

console.log('\nthe example config carries no real key');
const example = readFileSync(join(repoRoot, '.env.example'), 'utf8');
check('.env.example exists and is a placeholder', /YOUR-PROJECT/.test(example), true);
// A Supabase anon key is a JWT; one in the example file would be a real key
// committed by accident.
check('.env.example contains no JWT', /eyJ[A-Za-z0-9_-]{10,}/.test(example), false);

console.log('\nthe setup guide covers the parts that protect the library');
const guide = readFileSync(join(repoRoot, 'docs/PUBLISHING.md'), 'utf8');
for (const required of [
  'enable row level security',
  'for select',
  'for insert',
  'for delete',
  'service role',
]) {
  check(`the guide covers "${required}"`, guide.toLowerCase().includes(required.toLowerCase()), true);
}
check('the guide tells the owner to verify the policies', /sign out|second .* user/i.test(guide), true);

console.log('\na published material maps onto the shelf');
const sample: RemoteMaterial = {
  id: 'r-1',
  levelId: 'kharidar',
  paperId: 'kharidar-p1',
  sectionId: 'kharidar-p1-a',
  topicId: 'kharidar-p1-a#2',
  title: 'Today’s notes',
  fileName: 'notes.pdf',
  kind: 'pdf',
  size: 1024,
  publishedAt: 1_700_000_000_000,
  url: 'https://example.test/notes.pdf',
  watermark: 'CircularTriangle',
};
const meta = asMaterialMeta(sample);
// A reader must not be offered a Remove button for the owner's material, and
// `shelf` is what that button keys off.
check('published material reads as catalogue, not shelf', meta.origin, 'catalogue');
check('it keeps its topic so it files under the right line', meta.topicId, 'kharidar-p1-a#2');
check('it keeps its url so it can be opened', meta.url, sample.url);
check('it carries the watermark it was stamped with', meta.watermark, 'CircularTriangle');

console.log('\nthe build says which library it is using');
check('a build with no project configured is not live', existsSync(join(repoRoot, '.env.local')), false);

console.log(failures === 0 ? '\nAll library checks passed.' : `\n${failures} library check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
