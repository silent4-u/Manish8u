import type { MaterialMeta } from '../materials';
import { createFakeLibrary } from './fake';
import { createSupabaseLibrary, supabaseConfigured } from './supabase';
import type { RemoteLibrary, RemoteMaterial } from './types';

export type { LibraryUser, PublishInput, RemoteLibrary, RemoteMaterial } from './types';
export { FAKE_CREDENTIALS } from './fake';

/**
 * Which library this build talks to.
 *
 * A build given a Supabase project publishes to it. A build without one falls
 * back to a preview that lives in the current browser — so the publish flow
 * can be used and understood before anyone signs up for anything, and so a
 * contributor with no credentials can still run the app. The admin screen
 * always says which of the two is running, because the difference between
 * "every customer can see this" and "only you can see this" is the whole
 * point of the feature.
 */
let library: RemoteLibrary | null = null;

export function getLibrary(): RemoteLibrary {
  library ??= supabaseConfigured() ? createSupabaseLibrary() : createFakeLibrary();
  return library;
}

/** True when this build publishes to a real service rather than the preview. */
export function libraryIsLive(): boolean {
  return supabaseConfigured();
}

/** A published material in the shape the Materials screen already handles. */
export function asMaterialMeta(item: RemoteMaterial): MaterialMeta {
  return {
    id: item.id,
    // It is catalogue material as far as a reader is concerned: published by
    // the app's owner, not added on this device, and not removable from here.
    origin: 'catalogue',
    levelId: item.levelId,
    paperId: item.paperId,
    sectionId: item.sectionId,
    topicId: item.topicId,
    kind: item.kind,
    title: item.title,
    fileName: item.fileName,
    size: item.size,
    addedAt: item.publishedAt,
    url: item.url,
    watermark: item.watermark,
  };
}
