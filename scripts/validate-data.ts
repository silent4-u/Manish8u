/**
 * Content integrity checks for the study material and question bank.
 * Run with `npm run test:data`.
 */
import { LEVELS } from '../src/data/levels';
import { SUBJECTS, SUBJECT_BY_ID } from '../src/data/subjects';
import { LESSONS } from '../src/data/lessons';
import { QUESTIONS } from '../src/data/questions';
import { CURRENT_AFFAIRS } from '../src/data/currentAffairs';
import { CATALOGUE_ENTRIES } from '../src/data/materials';
import { MATERIAL_CONTENTS } from '../src/data/materialChapters';
import { FIGURE_IDS } from '../src/components/figures';
import { REFERENCES } from '../src/data/references';
import type { Bilingual } from '../src/types';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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
checkUnique('materials', CATALOGUE_ENTRIES.map((m) => m.id));

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

// --- primary sources point at syllabus sections that exist ---
const sectionIds = new Set<string>();
const sectionLevels = new Map<string, string>();
for (const level of LEVELS) {
  for (const paper of level.papers) {
    const all = [paper.sections, ...(paper.variants ?? []).map((v) => v.sections)];
    for (const sections of all) {
      for (const section of sections) {
        sectionIds.add(section.id);
        sectionLevels.set(section.id, level.id);
      }
    }
  }
}
checkUnique('references', REFERENCES.map((r) => r.id));
for (const ref of REFERENCES) {
  const where = `reference ${ref.id}`;
  checkBilingual(`${where}.title`, ref.title);
  checkBilingual(`${where}.publisher`, ref.publisher);
  checkBilingual(`${where}.what`, ref.what);
  checkBilingual(`${where}.cadence`, ref.cadence);
  if (ref.covers.length === 0) fail(`${where}: covers no syllabus section`);
  if (ref.levels.length === 0) fail(`${where}: cited by no level`);
  // A bare host, never a deep link: a path into a ministry site rots.
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(ref.site)) {
    fail(`${where}: site "${ref.site}" should be a bare host, not a URL or path`);
  }
  for (const id of ref.covers) {
    if (!sectionIds.has(id)) {
      fail(`${where}: covers unknown syllabus section "${id}"`);
      continue;
    }
    // A section it covers must belong to a post that actually cites it.
    const owner = sectionLevels.get(id)!;
    if (!ref.levels.includes(owner as (typeof ref.levels)[number])) {
      fail(`${where}: covers ${id} on level "${owner}" but does not list that level`);
    }
  }
}

// --- every lesson figure names a drawing the app actually has ---
const knownFigures = new Set(FIGURE_IDS);
const usedFigures = new Set<string>();
for (const lesson of LESSONS) {
  for (const block of lesson.blocks) {
    if (block.type !== 'figure') continue;
    usedFigures.add(block.figureId);
    if (!knownFigures.has(block.figureId)) {
      fail(`lesson ${lesson.id}: unknown figure "${block.figureId}"`);
    }
    checkBilingual(`lesson ${lesson.id} figure ${block.figureId}.caption`, block.caption);
    // The alt text is what a screen reader gets instead of the drawing.
    checkBilingual(`lesson ${lesson.id} figure ${block.figureId}.alt`, block.alt);
  }
}
for (const id of knownFigures) {
  if (!usedFigures.has(id)) warnings.push(`figure ${id}: drawn but not used by any lesson`);
}

// --- alternative versions of a paper are as well formed as the paper ---
const variantIds = new Set<string>();
for (const level of LEVELS) {
  for (const paper of level.papers) {
    const variants = paper.variants ?? [];
    if (variants.length > 0 && !paper.appliesTo) {
      fail(`paper ${paper.id}: has variants but does not say who its own sections are for`);
    }
    for (const variant of variants) {
      const where = `variant ${variant.id}`;
      if (variantIds.has(variant.id)) fail(`${where}: duplicate id`);
      variantIds.add(variant.id);
      checkBilingual(`${where}.appliesTo`, variant.appliesTo);
      if (variant.sections.length === 0) fail(`${where}: no sections`);

      // A variant is a whole alternative paper, so it must be worth the same.
      const total = variant.sections.reduce((sum, section) => sum + (section.marks ?? 0), 0);
      if (total !== paper.fullMarks) {
        fail(`${where}: sections total ${total} but the paper is out of ${paper.fullMarks}`);
      }
      for (const section of variant.sections) {
        checkBilingual(`${where} section ${section.id}.name`, section.name);
        if (section.topics.length === 0) fail(`${where} section ${section.id}: no topics`);
        for (const id of section.subjectIds) {
          if (!SUBJECT_BY_ID[id]) fail(`${where} section ${section.id}: unknown subject "${id}"`);
        }
      }
    }
  }
}

// --- published materials point at a real paper, section and file ---
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const entry of CATALOGUE_ENTRIES) {
  const where = `material ${entry.id}`;
  if (!entry.title.trim()) fail(`${where}: missing title`);
  if (Number.isNaN(Date.parse(entry.published))) fail(`${where}: "${entry.published}" is not a date`);

  const level = LEVELS.find((l) => l.id === entry.levelId);
  if (!level) {
    fail(`${where}: unknown level "${entry.levelId}"`);
    continue;
  }
  const paper = level.papers.find((p) => p.id === entry.paperId);
  if (!paper) {
    fail(`${where}: level "${entry.levelId}" has no paper "${entry.paperId}"`);
    continue;
  }
  if (entry.sectionId && !paper.sections.some((s) => s.id === entry.sectionId)) {
    fail(`${where}: paper "${paper.id}" has no section "${entry.sectionId}"`);
  }
  // A missing file would ship as a dead download, so it fails the build here.
  if (!existsSync(join(repoRoot, 'public/materials', entry.file))) {
    fail(`${where}: public/materials/${entry.file} does not exist`);
  }
}

// --- published chapter indexes ---
// A chapter pointing at the wrong page sends a candidate to the wrong reading,
// so the index is checked against the catalogue it claims to describe.
const published = new Set(CATALOGUE_ENTRIES.map((entry) => entry.file));
for (const [file, contents] of Object.entries(MATERIAL_CONTENTS)) {
  const where = `contents ${file}`;
  if (!published.has(file)) fail(`${where}: no catalogue entry publishes this file`);
  if (contents.pages <= 0) fail(`${where}: page count must be positive`);
  if (contents.chapters.length === 0) fail(`${where}: no chapters`);
  if (!contents.chapters.some((c) => c.level === 1)) fail(`${where}: no top-level chapter`);

  let last = 0;
  for (const chapter of contents.chapters) {
    if (!chapter.title.trim()) fail(`${where}: a chapter has no title`);
    if (chapter.page < 1 || chapter.page > contents.pages) {
      fail(`${where}: "${chapter.title}" is on page ${chapter.page} of ${contents.pages}`);
    }
    // Chapters are listed in reading order, so a step backwards means the
    // index picked up a contents-page listing rather than the heading itself.
    if (chapter.page < last) {
      fail(`${where}: "${chapter.title}" on page ${chapter.page} follows page ${last}`);
    }
    last = chapter.page;
  }
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
