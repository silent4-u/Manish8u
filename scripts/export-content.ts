/**
 * Export the study content to plain JSON, for consumption by any client.
 *
 * The web app imports the TypeScript modules directly; a native client (or any
 * other consumer) reads these files instead, so the content is authored once
 * and stays in one place. Run with `npm run export:content`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEVELS, SYLLABUS_REVISION_NOTE } from '../src/data/levels';
import { SUBJECTS } from '../src/data/subjects';
import { LESSONS } from '../src/data/lessons';
import { QUESTIONS } from '../src/data/questions';
import { CURRENT_AFFAIRS, CURRENT_AFFAIRS_NOTE } from '../src/data/currentAffairs';
import { UI } from '../src/i18n/strings';

const outDir = process.argv[2] ?? 'content';
mkdirSync(outDir, { recursive: true });

/** Interface strings, split per language so a client can load just one. */
const uiEn: Record<string, string> = {};
const uiNe: Record<string, string> = {};
for (const [key, value] of Object.entries(UI)) {
  uiEn[key] = value.en;
  uiNe[key] = value.ne;
}

const files: Record<string, unknown> = {
  'levels.json': { note: SYLLABUS_REVISION_NOTE, levels: LEVELS },
  'subjects.json': { subjects: SUBJECTS },
  'lessons.json': { lessons: LESSONS },
  'questions.json': { questions: QUESTIONS },
  'affairs.json': { note: CURRENT_AFFAIRS_NOTE, affairs: CURRENT_AFFAIRS },
  'strings-en.json': uiEn,
  'strings-ne.json': uiNe,
};

const manifest = {
  generatedBy: 'npm run export:content',
  schemaVersion: 1,
  counts: {
    levels: LEVELS.length,
    subjects: SUBJECTS.length,
    lessons: LESSONS.length,
    questions: QUESTIONS.length,
    currentAffairs: CURRENT_AFFAIRS.length,
    uiStrings: Object.keys(UI).length,
  },
  languages: ['en', 'ne'],
};
files['manifest.json'] = manifest;

for (const [name, data] of Object.entries(files)) {
  const path = join(outDir, name);
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  const kb = (JSON.stringify(data).length / 1024).toFixed(1);
  console.log(`  ${name.padEnd(18)} ${kb.padStart(7)} KB`);
}

console.log(`\nExported to ${outDir}/:`, JSON.stringify(manifest.counts));
