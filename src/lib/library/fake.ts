import type { LibraryUser, PublishInput, RemoteLibrary, RemoteMaterial } from './types';

/**
 * A published library that lives in this browser only.
 *
 * This exists so the publish flow can be built, demonstrated and tested
 * without a cloud account — and so the cloud adapter has something to be
 * checked against. It is not a backend: nothing it stores reaches anyone
 * else, which is the one thing the real library is for. The admin screen
 * says so plainly whenever it is what is running.
 *
 * The owner's credentials here are fixed and public. That is deliberate:
 * pretending otherwise would invite someone to treat this as a login.
 */
const FAKE_EMAIL = 'owner@example.com';
const FAKE_PASSWORD = 'preview';
const STORE_KEY = 'lss.library.fake';
const SESSION_KEY = 'lss.library.fake.session';

interface Stored {
  meta: RemoteMaterial;
  /** The stamped bytes, as a data URL, so a reload can still open them. */
  body: string;
}

function read(): Stored[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Stored[]) : [];
  } catch {
    return [];
  }
}

function write(items: Stored[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  } catch {
    // Out of quota: the publish fails loudly rather than half-succeeding.
    throw new Error('This browser has no room left to store the file.');
  }
}

async function toDataUrl(body: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('could not read the file'));
    reader.readAsDataURL(body);
  });
}

export function createFakeLibrary(): RemoteLibrary {
  return {
    name: 'Preview library (this browser only)',

    async list(): Promise<RemoteMaterial[]> {
      return read().map((item) => ({ ...item.meta, url: item.body }));
    },

    async currentUser(): Promise<LibraryUser | null> {
      try {
        return localStorage.getItem(SESSION_KEY) ? { id: 'fake-owner', email: FAKE_EMAIL } : null;
      } catch {
        return null;
      }
    },

    async signIn(email: string, password: string): Promise<LibraryUser> {
      if (email.trim().toLowerCase() !== FAKE_EMAIL || password !== FAKE_PASSWORD) {
        throw new Error('Wrong email or password.');
      }
      localStorage.setItem(SESSION_KEY, '1');
      return { id: 'fake-owner', email: FAKE_EMAIL };
    },

    async signOut(): Promise<void> {
      localStorage.removeItem(SESSION_KEY);
    },

    async publish(input: PublishInput, body: Blob): Promise<RemoteMaterial> {
      if (!(await this.currentUser())) throw new Error('Sign in first.');
      const meta: RemoteMaterial = {
        id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        ...input,
        size: body.size,
        publishedAt: Date.now(),
        url: '',
        watermark: 'CircularTriangle',
      };
      const items = read();
      items.push({ meta, body: await toDataUrl(body) });
      write(items);
      return { ...meta, url: items[items.length - 1].body };
    },

    async unpublish(id: string): Promise<void> {
      if (!(await this.currentUser())) throw new Error('Sign in first.');
      write(read().filter((item) => item.meta.id !== id));
    },
  };
}

/** Shown on the admin screen so nobody mistakes the preview for a backend. */
export const FAKE_CREDENTIALS = { email: FAKE_EMAIL, password: FAKE_PASSWORD };
