import type { ExamLevel, LevelId, Paper, SyllabusSection } from '../types';

/**
 * A reference file filed against one paper of an exam. Two kinds share this
 * shape: `shelf` items the candidate added from their own device, and
 * `catalogue` items published with the app. Only the first kind can be
 * removed, and only the second has a URL to fetch.
 */
export type MaterialOrigin = 'shelf' | 'catalogue';

export interface MaterialMeta {
  id: string;
  origin: MaterialOrigin;
  levelId: LevelId;
  paperId: string;
  /** Section within the paper, or null when it covers the paper as a whole. */
  sectionId: string | null;
  title: string;
  fileName: string;
  /** Size in bytes; 0 when a catalogue entry does not declare one. */
  size: number;
  addedAt: number;
  /** Path a catalogue file is fetched from, relative to the app root. */
  url?: string;
  /** Watermark carried by a published file, shown so its origin is plain. */
  watermark?: string;
  /**
   * Position in a published set. A dozen booklets published on the same day
   * would otherwise fall into alphabetical order, which is no order at all to
   * read them in; this keeps them in the sequence they were written for.
   */
  order?: number;
}

/**
 * Above this a single file is refused. Browsers grant a shared quota per
 * origin and a phone runs out of it quickly, so one oversized scan must not
 * be allowed to fill the shelf on its own.
 */
export const MAX_MATERIAL_BYTES = 40 * 1024 * 1024;

export type RejectReason = 'not-pdf' | 'too-large' | 'empty';

export interface FileFacts {
  name: string;
  size: number;
  type: string;
}

/** Why a chosen file cannot be filed, or null when it is fine to store. */
export function rejectReason(file: FileFacts): RejectReason | null {
  if (!Number.isFinite(file.size) || file.size <= 0) return 'empty';
  if (file.size > MAX_MATERIAL_BYTES) return 'too-large';
  const looksPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  return looksPdf ? null : 'not-pdf';
}

/** The five bytes every PDF opens with: `%PDF-`. */
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d];

/**
 * True when the bytes carry a PDF header. A file renamed to `.pdf` passes the
 * check above but fails here, which is the point: the shelf should not hold
 * something no viewer can open. The header is allowed to sit a little way in,
 * so this scans the opening kilobyte rather than only offset zero.
 */
export function hasPdfHeader(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.length, 1024);
  for (let i = 0; i + PDF_MAGIC.length <= limit; i += 1) {
    if (PDF_MAGIC.every((byte, j) => bytes[i + j] === byte)) return true;
  }
  return false;
}

/** A readable title from a file name, used to pre-fill the title field. */
export function defaultTitle(fileName: string): string {
  const base = fileName.replace(/\.[^./\\]+$/, '');
  const words = base.replace(/[_+]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!words) return fileName.trim();
  return words.length > 80 ? `${words.slice(0, 79).trimEnd()}…` : words;
}

/** Size for display. Digits are localised by the caller, not here. */
export function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) return '0 KB';
  const mb = size / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

/** One heading in a published PDF's contents. */
export interface MaterialChapter {
  /** The document's own heading, quoted rather than translated. */
  title: string;
  /** 1-based page the chapter opens on. */
  page: number;
  /** 1 for a chapter, 2 for a section inside one. */
  level: 1 | 2;
}

/**
 * A published PDF's chapter index, so a booklet can be opened at the chapter
 * being studied. Absent for a file whose headings could not be read — see
 * `src/data/materialChapters.ts`.
 */
export interface MaterialContents {
  /** Page count, as read from the file when the index was built. */
  pages: number;
  chapters: MaterialChapter[];
}

export interface SectionShelf {
  section: SyllabusSection;
  items: MaterialMeta[];
}

export interface PaperShelf {
  paper: Paper;
  /** Everything filed under the paper, whatever its section. */
  items: MaterialMeta[];
  sections: SectionShelf[];
  /** Filed against the paper as a whole rather than one of its sections. */
  general: MaterialMeta[];
}

/**
 * A declared reading order first, then newest first, then by title so the
 * order never depends on insertion. Anything without a declared position
 * sorts after everything that has one, which is where a candidate's own
 * uploads belong: after the set the app shipped.
 */
const UNPLACED = Number.MAX_SAFE_INTEGER;

function ordered(items: MaterialMeta[]): MaterialMeta[] {
  return [...items].sort(
    (a, b) =>
      (a.order ?? UNPLACED) - (b.order ?? UNPLACED) ||
      b.addedAt - a.addedAt ||
      a.title.localeCompare(b.title),
  );
}

/**
 * Arrange a level's materials into one shelf per paper. A material whose
 * section no longer exists falls back to the paper's general shelf instead of
 * disappearing, which is what happens when a syllabus revision renumbers the
 * sections under a paper that itself survives.
 */
export function shelvesFor(level: ExamLevel, materials: MaterialMeta[]): PaperShelf[] {
  const mine = materials.filter((m) => m.levelId === level.id);
  return level.papers.map((paper) => {
    const items = ordered(mine.filter((m) => m.paperId === paper.id));
    const known = new Set(paper.sections.map((s) => s.id));
    return {
      paper,
      items,
      sections: paper.sections.map((section) => ({
        section,
        items: items.filter((m) => m.sectionId === section.id),
      })),
      general: items.filter((m) => m.sectionId === null || !known.has(m.sectionId)),
    };
  });
}

/**
 * Materials filed against a paper this level no longer has. A syllabus
 * revision can drop a paper — the Section Officer papers were renumbered in
 * 2082 — and anything filed under it must stay reachable rather than be lost
 * to a stale id.
 */
export function unfiledFor(level: ExamLevel, materials: MaterialMeta[]): MaterialMeta[] {
  const known = new Set(level.papers.map((p) => p.id));
  return ordered(materials.filter((m) => m.levelId === level.id && !known.has(m.paperId)));
}

/** Total bytes held on the shelf for one level. */
export function shelfBytes(levelId: LevelId, materials: MaterialMeta[]): number {
  return materials
    .filter((m) => m.levelId === levelId && m.origin === 'shelf')
    .reduce((sum, m) => sum + m.size, 0);
}
