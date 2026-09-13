import type { LibraryUser, PublishInput, RemoteLibrary, RemoteMaterial } from './types';
import type { MaterialKind } from '../materials';
import type { LevelId } from '../../types';

/**
 * The published library, backed by Supabase.
 *
 * Two pieces at the provider: a `materials` table holding one row per
 * published file, and a public storage bucket holding the files themselves.
 *
 * On the key in the build: `VITE_SUPABASE_ANON_KEY` is meant to be public and
 * ships in the bundle. It identifies the project, it does not authorise
 * anything. What protects the library is the row-level security policy —
 * anyone may read, only the owner's user id may write — which runs at the
 * provider and cannot be talked out of it by a modified client. A
 * service-role key would authorise everything and must never appear in this
 * app; see `docs/PUBLISHING.md`.
 */

/**
 * Vite substitutes `import.meta.env` at build time; outside a Vite build —
 * a Node script running these checks, for one — it is not there at all, and
 * reading through it throws before anything else can run.
 */
function env(key: keyof ImportMetaEnv): string | undefined {
  return typeof import.meta !== 'undefined' ? import.meta.env?.[key] : undefined;
}

const URL_KEY = env('VITE_SUPABASE_URL');
const ANON_KEY = env('VITE_SUPABASE_ANON_KEY');
const BUCKET = env('VITE_SUPABASE_BUCKET') ?? 'materials';
const TABLE = 'materials';

/** True when this build was given a project to talk to. */
export function supabaseConfigured(): boolean {
  return Boolean(URL_KEY && ANON_KEY);
}

/** One row as the table stores it. Snake case, because Postgres. */
interface Row {
  id: string;
  level_id: string;
  paper_id: string;
  section_id: string | null;
  topic_id: string | null;
  title: string;
  file_name: string;
  kind: string;
  size: number;
  storage_path: string;
  published_at: string;
  watermark: string;
}

type Client = import('@supabase/supabase-js').SupabaseClient;

/** The client is a couple of hundred kilobytes; it loads on first use. */
let clientPromise: Promise<Client> | null = null;

function client(): Promise<Client> {
  clientPromise ??= (async () => {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(URL_KEY!, ANON_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  })();
  return clientPromise;
}

function toMaterial(row: Row, publicUrl: string): RemoteMaterial {
  return {
    id: row.id,
    levelId: row.level_id as LevelId,
    paperId: row.paper_id,
    sectionId: row.section_id,
    topicId: row.topic_id,
    title: row.title,
    fileName: row.file_name,
    kind: (row.kind === 'image' ? 'image' : 'pdf') as MaterialKind,
    size: row.size,
    publishedAt: Date.parse(row.published_at) || Date.now(),
    url: publicUrl,
    watermark: row.watermark,
  };
}

export function createSupabaseLibrary(): RemoteLibrary {
  return {
    name: 'Supabase',

    async list(): Promise<RemoteMaterial[]> {
      // A customer offline, or an outage at the provider, must see the
      // material that shipped with the app rather than an error.
      try {
        const db = await client();
        const { data, error } = await db
          .from(TABLE)
          .select('*')
          .order('published_at', { ascending: false });
        if (error || !data) return [];
        return (data as Row[]).map((row) => {
          const { data: file } = db.storage.from(BUCKET).getPublicUrl(row.storage_path);
          return toMaterial(row, file.publicUrl);
        });
      } catch {
        return [];
      }
    },

    async currentUser(): Promise<LibraryUser | null> {
      try {
        const db = await client();
        const { data } = await db.auth.getUser();
        if (!data.user?.email) return null;
        return { id: data.user.id, email: data.user.email };
      } catch {
        return null;
      }
    },

    async signIn(email: string, password: string): Promise<LibraryUser> {
      const db = await client();
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error || !data.user?.email) throw new Error(error?.message ?? 'Could not sign in.');
      return { id: data.user.id, email: data.user.email };
    },

    async signOut(): Promise<void> {
      const db = await client();
      await db.auth.signOut();
    },

    async publish(input: PublishInput, body: Blob): Promise<RemoteMaterial> {
      const db = await client();
      const user = await this.currentUser();
      if (!user) throw new Error('Sign in first.');

      // Path is namespaced by level and by time so two uploads of the same
      // file name never collide, and a listing of the bucket reads sensibly.
      const stamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const safe = input.fileName.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
      const path = `${input.levelId}/${stamp}-${safe}`;

      const { error: uploadError } = await db.storage.from(BUCKET).upload(path, body, {
        contentType: input.kind === 'pdf' ? 'application/pdf' : body.type || 'image/png',
        upsert: false,
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const row = {
        level_id: input.levelId,
        paper_id: input.paperId,
        section_id: input.sectionId,
        topic_id: input.topicId,
        title: input.title,
        file_name: input.fileName,
        kind: input.kind,
        size: body.size,
        storage_path: path,
        watermark: 'CircularTriangle',
      };
      const { data, error } = await db.from(TABLE).insert(row).select().single();
      if (error || !data) {
        // Leaving the object behind would orphan bytes nothing points at.
        await db.storage.from(BUCKET).remove([path]);
        throw new Error(`Could not publish: ${error?.message ?? 'no row returned'}`);
      }
      const { data: file } = db.storage.from(BUCKET).getPublicUrl(path);
      return toMaterial(data as Row, file.publicUrl);
    },

    async unpublish(id: string): Promise<void> {
      const db = await client();
      const { data, error } = await db.from(TABLE).select('storage_path').eq('id', id).single();
      if (error || !data) throw new Error('That material is no longer published.');
      const { error: deleteError } = await db.from(TABLE).delete().eq('id', id);
      if (deleteError) throw new Error(`Could not withdraw: ${deleteError.message}`);
      await db.storage.from(BUCKET).remove([(data as { storage_path: string }).storage_path]);
    },
  };
}
