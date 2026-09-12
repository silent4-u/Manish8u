/*
 * What has gone stale.
 *
 * This is a report, not a gate. It is deliberately kept out of `npm test`,
 * because its answer changes with the calendar rather than with the code: a
 * suite that fails because three months have passed teaches the team to
 * ignore it. `npm run check:freshness` is what the reference steward runs to
 * decide what to look at, and what a maintainer runs before a release.
 *
 * It exits non-zero only for something a person can fix today — a reference
 * checked in the future, an unverified affair with no source to check it
 * against — and reports everything else as a due list.
 */
import { REFERENCES } from '../src/data/references';
import { CURRENT_AFFAIRS } from '../src/data/currentAffairs';
import { WRITTEN_QUESTIONS } from '../src/data/written';

const DAY = 24 * 60 * 60 * 1000;
const today = new Date();

/**
 * How long an entry may go unchecked before it is due, by how often the
 * publisher revises it. An annual publication checked fourteen months ago has
 * certainly been superseded; a statute may sit unamended for years, but a
 * yearly look is what catches the amendment that did land.
 */
const DUE_DAYS: { match: RegExp; days: number; why: string }[] = [
  { match: /annual|वार्षिक/i, days: 120, why: 'published annually with the budget' },
  { match: /five years|पाँच वर्ष/i, days: 180, why: 'a new plan every five years' },
  { match: /ten years|दस वर्ष/i, days: 365, why: 'a ten-year cycle' },
  { match: /amended|संशोधन/i, days: 365, why: 'amended from time to time' },
];

function dueDays(cadenceEn: string, cadenceNe: string): { days: number; why: string } {
  for (const rule of DUE_DAYS) {
    if (rule.match.test(cadenceEn) || rule.match.test(cadenceNe)) return { days: rule.days, why: rule.why };
  }
  return { days: 365, why: 'no cadence matched, so a yearly look is assumed' };
}

const errors: string[] = [];
const due: string[] = [];
const ok: string[] = [];

console.log('References');
for (const ref of [...REFERENCES].sort((a, b) => a.lastChecked.localeCompare(b.lastChecked))) {
  const checked = Date.parse(ref.lastChecked);
  if (Number.isNaN(checked)) {
    errors.push(`reference ${ref.id}: "${ref.lastChecked}" is not a date`);
    continue;
  }
  const age = Math.floor((today.getTime() - checked) / DAY);
  if (age < 0) {
    errors.push(`reference ${ref.id}: last checked ${ref.lastChecked}, which is in the future`);
    continue;
  }
  const { days, why } = dueDays(ref.cadence.en, ref.cadence.ne);
  const line = `${ref.id.padEnd(26)} ${String(age).padStart(4)}d ago  ${ref.site}`;
  if (age >= days) {
    due.push(`${ref.id} — ${age} days since it was checked, due at ${days} (${why})`);
    console.log(`  DUE   ${line}`);
  } else {
    ok.push(ref.id);
    console.log(`  ok    ${line}`);
  }
}

console.log('\nCurrent affairs awaiting verification');
const unverified = CURRENT_AFFAIRS.filter((a) => a.status === 'unverified');
if (unverified.length === 0) {
  console.log('  none');
}
for (const affair of unverified) {
  const age = Math.floor((today.getTime() - Date.parse(affair.date)) / DAY);
  if (!affair.sources || affair.sources.length === 0) {
    // The app shows these marked unverified; without a source there is no way
    // for anyone to settle them, so they cannot stay.
    errors.push(`affair ${affair.id}: unverified with no source to check it against`);
  }
  console.log(`  ${age >= 90 ? 'STALE' : 'open '} ${affair.id.padEnd(26)} ${String(age).padStart(4)}d  ${affair.title.en.slice(0, 52)}`);
  if (age >= 90) due.push(`affair ${affair.id} — unverified for ${age} days; verify against a primary source or drop it`);
}

console.log('\nAnswers carrying a figure that has to be refreshed');
const dated = WRITTEN_QUESTIONS.filter((q) => q.freshnessNote);
for (const q of dated) {
  console.log(`  ${q.id.padEnd(22)} ${q.paperId}`);
}
console.log(`  ${dated.length} of ${WRITTEN_QUESTIONS.length} written answers point at a publication rather than printing a number`);

console.log('\n---');
console.log(`${ok.length} reference(s) current, ${due.filter((d) => !d.startsWith('affair')).length} due for a look.`);
if (due.length > 0) {
  console.log('\nDue now, oldest first:');
  for (const item of due) console.log(`  - ${item}`);
}
if (errors.length > 0) {
  console.log('\nProblems that need fixing regardless of the calendar:');
  for (const item of errors) console.log(`  - ${item}`);
}
process.exit(errors.length === 0 ? 0 : 1);
