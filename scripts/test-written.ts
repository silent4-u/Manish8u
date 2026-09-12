/*
 * Checks on long-answer practice.
 *
 * The one that matters most is the last: an objective paper must never carry a
 * written question, and a written paper must never be left to be practised as
 * multiple choice, because the exercise has to match how the paper is answered.
 */
import { LEVELS, LEVEL_BY_ID } from '../src/data/levels';
import { WRITTEN_QUESTIONS, writtenFor } from '../src/data/written';
import { targetWords, writtenCoverage, writtenGroups, writtenPapers } from '../src/lib/written';
import type { WrittenQuestion } from '../src/types';

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

console.log('writtenPapers');
for (const level of LEVELS) {
  const papers = writtenPapers(level);
  check(
    `${level.id}: only papers answered in prose`,
    papers.every((p) => p.format !== 'objective'),
    true,
  );
  check(
    `${level.id}: the first paper is excluded`,
    papers.some((p) => p.id.endsWith('-p1')),
    false,
  );
}

console.log('writtenGroups');
const officer = LEVEL_BY_ID.adhikrit;
const paper2 = officer.papers.find((p) => p.id === 'adhikrit-p2')!;

function q(over: Partial<WrittenQuestion> & Pick<WrittenQuestion, 'id'>): WrittenQuestion {
  const text = { en: over.id, ne: over.id };
  return {
    levels: ['adhikrit'],
    paperId: paper2.id,
    sectionId: paper2.sections[0].id,
    subjectId: 'governance',
    marks: 10,
    minutes: 18,
    prompt: text,
    keyPoints: [text],
    intro: text,
    parts: [{ heading: text, points: [text] }],
    conclusion: text,
    ...over,
  };
}

const set: WrittenQuestion[] = [
  q({ id: 'b-second' }),
  q({ id: 'a-first' }),
  q({ id: 'other-section', sectionId: paper2.sections[2].id }),
  q({ id: 'ghost-section', sectionId: 'no-such-section' }),
  q({ id: 'other-level', levels: ['kharidar'], paperId: 'kharidar-p2', sectionId: 'kharidar-p2-a' }),
];

const groups = writtenGroups(officer, set);
const p2 = groups.find((g) => g.paper.id === 'adhikrit-p2')!;
check('one group per written paper', groups.length, writtenPapers(officer).length);
check('sorted by id, not by file order', p2.questions.map((x) => x.id), [
  'a-first',
  'b-second',
  'ghost-section',
  'other-section',
]);
check(
  'each question sits under its own section',
  p2.sections.map((s) => s.questions.map((x) => x.id)),
  [['a-first', 'b-second'], [], ['other-section'], []],
);
check('a question on a dropped section is not lost', p2.general.map((x) => x.id), ['ghost-section']);
check('another post’s question is not shown', p2.questions.some((x) => x.id === 'other-level'), false);
check('marks are summed for coverage', p2.marksCovered, 40);
check('coverage is a percentage of full marks', writtenCoverage(p2), 40);

console.log('targetWords');
check('a ten mark answer', targetWords(10), { min: 250, max: 350 });
check('a five mark answer is half of it', targetWords(5), { min: 125, max: 175 });

console.log('the published set');
check('every question is attached to a paper answered in prose', WRITTEN_QUESTIONS.every((question) =>
  question.levels.every((levelId) => {
    const paper = LEVEL_BY_ID[levelId].papers.find((p) => p.id === question.paperId);
    return paper !== undefined && paper.format !== 'objective';
  }),
), true);

// Coverage is uneven while the set is being written, but a paper with nothing
// at all leaves a candidate with no exercise for it, so that is worth failing.
for (const level of LEVELS) {
  for (const paper of writtenPapers(level)) {
    const count = writtenFor(level.id, paper.id).length;
    check(`${paper.id} has at least one question`, count > 0, true);
  }
  for (const paper of writtenPapers(level)) {
    for (const section of paper.sections) {
      const covered = writtenFor(level.id, paper.id).some((x) => x.sectionId === section.id);
      check(`${section.id} has a worked example`, covered, true);
    }
  }
}

console.log(failures === 0 ? '\nAll written checks passed.' : `\n${failures} written check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
