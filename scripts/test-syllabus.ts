/**
 * The syllabus, pinned to the documents it was transcribed from.
 * Run with `npm run test:syllabus`.
 *
 * Every number below was read off the Public Service Commission's own PDFs:
 * the Section Officer syllabus approved 2081/03/20 and amended 2082/08/22,
 * and the Nayab Subba and Kharidar syllabi approved 2081/03/20. Topic counts
 * are the numbered items the commission prints, sub-items included.
 *
 * This exists so the syllabus cannot drift. If the commission revises a paper
 * this test fails, and the fixture is updated from the new document — never
 * the other way round. A failure here is never fixed by editing the app data
 * until the document has been checked.
 */
import { LEVELS, EXAM_MEDIUM_NOTE } from '../src/data/levels';
import type { Paper } from '../src/types';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}\n        document ${e}\n        app      ${a}`);
  }
}

interface PaperShape {
  id: string;
  marks: number;
  pass: number;
  mins: number;
  format: string;
  /** [section marks, number of numbered topics] for each section, in order. */
  sections: [number, number][];
}

const DOCUMENTS: { level: string; source: string; papers: PaperShape[] }[] = [
  {
    level: 'adhikrit',
    source: 'PSC Section Officer syllabus 2082 (approved 2081/03/20, amended 2082/08/22)',
    papers: [
      { id: 'adhikrit-p1', marks: 100, pass: 45, mins: 90, format: 'objective', sections: [[50, 20], [30, 5], [20, 4]] },
      { id: 'adhikrit-p2', marks: 100, pass: 40, mins: 180, format: 'subjective', sections: [[30, 7], [20, 10], [30, 8], [20, 6]] },
      { id: 'adhikrit-p3', marks: 100, pass: 40, mins: 180, format: 'subjective', sections: [[30, 9], [20, 9], [30, 10], [20, 9]] },
      { id: 'adhikrit-p4', marks: 100, pass: 40, mins: 180, format: 'subjective', sections: [[30, 10], [20, 7], [30, 14], [20, 9]] },
    ],
  },
  {
    level: 'nayabsubba',
    source: 'PSC Nayab Subba syllabus, approved 2081/03/20',
    papers: [
      { id: 'nasu-p1', marks: 100, pass: 45, mins: 45, format: 'objective', sections: [[60, 11], [40, 3]] },
      { id: 'nasu-p2', marks: 100, pass: 40, mins: 150, format: 'subjective', sections: [[35, 11], [35, 11], [30, 4]] },
      { id: 'nasu-p3', marks: 100, pass: 40, mins: 150, format: 'subjective', sections: [[35, 13], [35, 10], [30, 10]] },
    ],
  },
  {
    level: 'kharidar',
    source: 'PSC Kharidar syllabus, approved 2081/03/20',
    papers: [
      { id: 'kharidar-p1', marks: 100, pass: 45, mins: 45, format: 'objective', sections: [[60, 5], [40, 10]] },
      { id: 'kharidar-p2', marks: 100, pass: 40, mins: 150, format: 'subjective', sections: [[40, 7], [30, 10], [30, 8]] },
      { id: 'kharidar-p3', marks: 100, pass: 40, mins: 150, format: 'subjective', sections: [[35, 10], [35, 10], [30, 10]] },
    ],
  },
];

/** The one alternative paper the app carries, from the same officer document. */
const VARIANTS: { paperId: string; variantId: string; sections: [number, number][] }[] = [
  { paperId: 'adhikrit-p4', variantId: 'adhikrit-p4-audit', sections: [[30, 15], [30, 9], [20, 8], [20, 13]] },
];

function shapeOf(paper: Paper): PaperShape {
  return {
    id: paper.id,
    marks: paper.fullMarks,
    pass: paper.passMarks,
    mins: paper.durationMinutes,
    format: paper.format,
    sections: paper.sections.map((s) => [s.marks ?? 0, s.topics.length] as [number, number]),
  };
}

for (const doc of DOCUMENTS) {
  console.log(`${doc.level} — ${doc.source}`);
  const level = LEVELS.find((l) => l.id === doc.level);
  if (!level) {
    failures += 1;
    console.error(`  FAIL  level "${doc.level}" is missing from the app`);
    continue;
  }
  check(`${doc.level}: paper count`, level.papers.length, doc.papers.length);
  for (const expected of doc.papers) {
    const paper = level.papers.find((p) => p.id === expected.id);
    if (!paper) {
      failures += 1;
      console.error(`  FAIL  ${expected.id} is missing`);
      continue;
    }
    check(`${expected.id}`, shapeOf(paper), expected);
  }
  // Written marks are what a candidate plans around, so the total is pinned too.
  check(
    `${doc.level}: written total`,
    level.papers.reduce((sum, p) => sum + p.fullMarks, 0),
    doc.papers.reduce((sum, p) => sum + p.marks, 0),
  );
  // Every post must state the medium rule its own syllabus prints.
  const medium = EXAM_MEDIUM_NOTE[doc.level as keyof typeof EXAM_MEDIUM_NOTE];
  check(`${doc.level}: medium rule is bilingual`, Boolean(medium?.en && medium?.ne), true);
}

console.log('alternative papers');
for (const expected of VARIANTS) {
  const paper = LEVELS.flatMap((l) => l.papers).find((p) => p.id === expected.paperId);
  const variant = paper?.variants?.find((v) => v.id === expected.variantId);
  if (!variant) {
    failures += 1;
    console.error(`  FAIL  variant ${expected.variantId} is missing`);
    continue;
  }
  check(
    expected.variantId,
    variant.sections.map((s) => [s.marks ?? 0, s.topics.length]),
    expected.sections,
  );
}

// Nothing in the app may claim a topic the document does not carry, so every
// section must have topics and every topic must be written in both languages.
console.log('every topic is present and bilingual');
let topics = 0;
for (const level of LEVELS) {
  for (const paper of level.papers) {
    const all = [paper.sections, ...(paper.variants ?? []).map((v) => v.sections)];
    for (const sections of all) {
      for (const section of sections) {
        if (section.topics.length === 0) {
          failures += 1;
          console.error(`  FAIL  ${section.id}: no topics`);
        }
        for (const topic of section.topics) {
          topics += 1;
          if (!topic.en.trim() || !topic.ne.trim()) {
            failures += 1;
            console.error(`  FAIL  ${section.id}: a topic is missing one language`);
          }
        }
      }
    }
  }
}
console.log(`  ok    ${topics} syllabus topics, all bilingual`);

if (failures > 0) {
  console.error(`\n${failures} difference(s) from the source documents.`);
  process.exit(1);
}
console.log('\nSyllabus matches the source documents.');
