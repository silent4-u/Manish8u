import type { MaterialMeta } from './materials';

/**
 * The candidate's own PDFs, kept in IndexedDB. Records and file bodies live in
 * separate stores so listing the shelf reads only the small records — opening
 * the Materials screen never pulls a single megabyte off disk.
 *
 * Nothing here talks to a network. Files added on a device stay on that
 * device, which is what the About screen promises.
 */
const DB_NAME = 'lss-materials';
const DB_VERSION = 1;
const META_STORE = 'meta';
const FILE_STORE = 'files';

export function libraryAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

function settled(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB write was aborted'));
  });
}

let opening: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (opening) return opening;
  opening = new Promise<IDBDatabase>((resolve, reject) => {
    if (!libraryAvailable()) {
      reject(new Error('This browser has no IndexedDB, so materials cannot be stored'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(FILE_STORE)) db.createObjectStore(FILE_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Could not open the material library'));
    req.onblocked = () => reject(new Error('Another tab is upgrading the material library'));
  });
  // A failed open must not be cached, or a transient error is permanent.
  opening.catch(() => {
    opening = null;
  });
  return opening;
}

/** Every record on the shelf. File bodies are not touched. */
export async function listMaterials(): Promise<MaterialMeta[]> {
  const db = await open();
  const tx = db.transaction(META_STORE, 'readonly');
  return wrap(tx.objectStore(META_STORE).getAll() as IDBRequest<MaterialMeta[]>);
}

/**
 * Store a file and its record together. Both stores are written in one
 * transaction so a body can never end up on disk without a record pointing at
 * it, nor a record without its file.
 */
export async function addMaterial(meta: MaterialMeta, body: Blob): Promise<void> {
  const db = await open();
  const tx = db.transaction([META_STORE, FILE_STORE], 'readwrite');
  tx.objectStore(META_STORE).put(meta);
  tx.objectStore(FILE_STORE).put(body, meta.id);
  await settled(tx);
}

/** The stored file, or null when the record has lost its body. */
export async function readMaterial(id: string): Promise<Blob | null> {
  const db = await open();
  const tx = db.transaction(FILE_STORE, 'readonly');
  const found = await wrap(tx.objectStore(FILE_STORE).get(id) as IDBRequest<Blob | undefined>);
  return found ?? null;
}

export async function removeMaterial(id: string): Promise<void> {
  const db = await open();
  const tx = db.transaction([META_STORE, FILE_STORE], 'readwrite');
  tx.objectStore(META_STORE).delete(id);
  tx.objectStore(FILE_STORE).delete(id);
  await settled(tx);
}

/** True when a write failed because the browser's storage quota is full. */
export function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22);
}
