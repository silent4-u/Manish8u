/**
 * Content integrity checks for the study material and question bank.
 * Run with `npm run test:data`.
 */
import { LEVELS } from '../src/data/levels';
import { SUBJECTS, SUBJECT_BY_ID } from '../src/data/subjects';
import { LESSONS } from '../src/data/lessons';
import { QUESTIONS } from '../src/data/questions';
import { CURRENT_AFFAIRS } from '../src/data/currentAffairs';
import type { Bilingual } from '../src/types';

const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function checkBilingual(where: string, value: Bilingual) {
  if (!value.en?.trim()) fail(`${where}: missing English text`);
  if (!value.ne?.trim()) fail(`${where}: missing Nepali text`);
}

// --- unique ids ---
function checkUnique(label: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(`${label}: duplicate id "${id}"`);
    seen.add(id);
  }
}

checkUnique('levels', LEVELS.map((l) => l.id));
checkUnique('subjects', SUBJECTS.map((s) => s.id));
checkUnique('lessons', LESSONS.map((l) => l.id));
checkUnique('questions', QUESTIONS.map((q) => q.id));
checkUnique('currentAffairs', CURRENT_AFFAIRS.map((c) => c.id));

// --- levels and syllabus ---
for (const level of LEVELS) {
  checkBilingual(`level ${level.id}.name`, level.name);
  checkBilingual(`level ${level.id}.summary`, level.summary);
  if (level.papers.length === 0) fail(`level ${level.id}: no papers`);
  for (const paper of level.papers) {
    checkBilingual(`paper ${paper.id}.name`, paper.name);
    if (paper.passMarks > paper.fullMarks) fail(`paper ${paper.id}: pass marks exceed full marks`);
    const sectionMarks = paper.sections.reduce((sum, s) => sum + (s.marks ?? 0), 0);
    if (sectionMarks > 0 && sectionMarks !== paper.fullMarks) {
      warnings.push(`paper ${paper.id}: section marks total ${sectionMarks} but full marks are ${paper.fullMarks}`);
    }
    for (const section of paper.sections) {
      checkBilingual(`section ${section.id}.name`, section.name);
      if (section.topics.length === 0) fail(`section ${section.id}: no topics`);
      for (const subjectId of section.subjectIds) {
        if (!SUBJECT_BY_ID[subjectId]) fail(`section ${section.id}: unknown subject "${subjectId}"`);
      }
    }
  }
  if (level.mock.questionCount <= 0) fail(`level ${level.id}: mock question count must be positive`);
}

// --- lessons ---
for (const lesson of LESSONS) {
  checkBilingual(`lesson ${lesson.id}.title`, lesson.title);
  checkBilingual(`lesson ${lesson.id}.summary`, lesson.summary);
  if (!SUBJECT_BY_ID[lesson.subjectId]) fail(`lesson ${lesson.id}: unknown subject "${lesson.subjectId}"`);
  if (lesson.levels.length === 0) fail(`lesson ${lesson.id}: no levels`);
  if (lesson.blocks.length === 0) fail(`lesson ${lesson.id}: no content blocks`);
  for (const block of lesson.blocks) {
    if (block.type === 'table') {
      for (const [i, row] of block.rows.entries()) {
        if (row.length !== block.headers.length) {
          fail(`lesson ${lesson.id}: table row ${i} has ${row.length} cells but ${block.headers.length} headers`);
        }
      }
    }
  }
  // A lesson must be offered to at least one level that also studies the subject.
  const subject = SUBJECT_BY_ID[lesson.subjectId];
  if (subject && !lesson.levels.some((l) => subject.levels.includes(l))) {
    fail(`lesson ${lesson.id}: no level overlap with subject "${lesson.subjectId}"`);
  }
}

// --- questions ---
for (const question of QUESTIONS) {
  checkBilingual(`question ${question.id}.prompt`, question.prompt);
  checkBilingual(`question ${question.id}.explanation`, question.explanation);
  if (!SUBJECT_BY_ID[question.subjectId]) fail(`question ${question.id}: unknown subject "${question.subjectId}"`);
  if (question.options.length !== 4) fail(`question ${question.id}: expected 4 options, found ${question.options.length}`);
  question.options.forEach((option, i) => checkBilingual(`question ${question.id}.option[${i}]`, option));
  if (question.answer < 0 || question.answer >= question.options.length) {
    fail(`question ${question.id}: answer index out of range`);
  }
  const englishOptions = question.options.map((o) => o.en.trim().toLowerCase());
  if (new Set(englishOptions).size !== englishOptions.length) {
    fail(`question ${question.id}: duplicate options`);
  }
  const subject = SUBJECT_BY_ID[question.subjectId];
  if (subject) {
    for (const level of question.levels) {
      if (!subject.levels.includes(level)) {
        fail(`question ${question.id}: level "${level}" does not study subject "${question.subjectId}"`);
      }
    }
  }
}

// --- current affairs ---
for (const affair of CURRENT_AFFAIRS) {
  checkBilingual(`affair ${affair.id}.title`, affair.title);
  checkBilingual(`affair ${affair.id}.detail`, affair.detail);
  if (!/^\d{4}-\d{2}$/.test(affair.month)) {
    fail(`affair ${affair.id}: month "${affair.month}" is not YYYY-MM`);
  }
  if (!affair.date.startsWith(affair.month)) {
    fail(`affair ${affair.id}: date ${affair.date} does not fall in month ${affair.month}`);
  }
  if (affair.status !== 'verified' && affair.status !== 'unverified') {
    fail(`affair ${affair.id}: unknown status "${affair.status}"`);
  }
  // An unverified claim without a source or a stated doubt is indistinguishable
  // from a verified one to the reader, which is the failure worth preventing.
  if (affair.status === 'unverified') {
    if (!affair.sources?.length) fail(`affair ${affair.id}: unverified with no sources`);
    if (!affair.checkNote) fail(`affair ${affair.id}: unverified with no checkNote`);
    else checkBilingual(`affair ${affair.id}.checkNote`, affair.checkNote);
  }
  for (const src of affair.sources ?? []) {
    if (!/^https?:\/\//.test(src)) fail(`affair ${affair.id}: source "${src}" is not a URL`);
  }
}

// --- every level must have enough questions for its mock test ---
for (const level of LEVELS) {
  const pool = QUESTIONS.filter((q) => q.levels.includes(level.id));
  if (pool.length < level.mock.questionCount) {
    fail(`level ${level.id}: mock needs ${level.mock.questionCount} questions but the pool has ${pool.length}`);
  }
  const lessonPool = LESSONS.filter((l) => l.levels.includes(level.id));
  if (lessonPool.length === 0) fail(`level ${level.id}: no lessons`);
}

// --- every subject offered to a level should have questions for it ---
for (const subject of SUBJECTS) {
  for (const level of subject.levels) {
    const count = QUESTIONS.filter((q) => q.subjectId === subject.id && q.levels.includes(level)).length;
    if (count === 0) warnings.push(`subject ${subject.id}: no questions for level "${level}"`);
  }
}

// --- report ---
const byLevel = LEVELS.map((level) => {
  const q = QUESTIONS.filter((x) => x.levels.includes(level.id)).length;
  const l = LESSONS.filter((x) => x.levels.includes(level.id)).length;
  return `  ${level.id.padEnd(12)} ${String(q).padStart(3)} questions, ${String(l).padStart(2)} lessons`;
}).join('\n');

console.log(`Content: ${LESSONS.length} lessons, ${QUESTIONS.length} questions, ${SUBJECTS.length} subjects, ${LEVELS.length} levels`);
console.log(byLevel);

for (const warning of warnings) console.warn(`warning  ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`error    ${error}`);
  console.error(`\n${errors.length} error(s) found.`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
