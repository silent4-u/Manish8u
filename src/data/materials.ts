import type { LevelId } from '../types';
import type { MaterialMeta } from '../lib/materials';

/**
 * Materials published with the app itself, as opposed to the ones a candidate
 * adds from their own device. Adding one is deliberately a code change rather
 * than an upload: whatever ships here reaches every installation, so it goes
 * through the same review as any other content.
 *
 * To publish a PDF:
 *   1. Stamp it in the Content Desk so it carries your watermark.
 *   2. Drop the stamped file into `public/materials/`.
 *   3. Add an entry below naming the paper — and, when it belongs to one, the
 *      section — it should be filed under.
 * `npm run test:data` then checks the paper, the section and the file itself
 * all exist before the entry can ship.
 */
export interface CatalogueEntry {
  id: string;
  levelId: LevelId;
  /** Paper id from `src/data/levels.ts`, e.g. `adhikrit-p4`. */
  paperId: string;
  /** Section id within that paper. Omit to file under the whole paper. */
  sectionId?: string;
  title: string;
  /** File name inside `public/materials/`. */
  file: string;
  /** Size in bytes, shown before the file is fetched. */
  size?: number;
  /** ISO date the material was published. */
  published: string;
  /** Watermark the file carries, so its origin is visible in the list. */
  watermark?: string;
}

export const CATALOGUE_ENTRIES: CatalogueEntry[] = [];

export const CATALOGUE: MaterialMeta[] = CATALOGUE_ENTRIES.map((entry) => ({
  id: entry.id,
  origin: 'catalogue',
  levelId: entry.levelId,
  paperId: entry.paperId,
  sectionId: entry.sectionId ?? null,
  title: entry.title,
  fileName: entry.file,
  size: entry.size ?? 0,
  addedAt: Date.parse(entry.published),
  // Relative to the app root; the hash router leaves the document URL alone.
  url: `materials/${entry.file}`,
  watermark: entry.watermark,
}));
