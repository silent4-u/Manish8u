/** Injected by Vite from package.json — see `define` in vite.config.ts. */
declare const __APP_VERSION__: string;

/**
 * Vite resolves a `?url` import to the built asset's path. Used to hand pdf.js
 * the worker it needs without hard-coding where the build puts it.
 */
declare module '*?url' {
  const url: string;
  export default url;
}

/**
 * Build-time configuration Vite substitutes into the bundle.
 *
 * The anon key is meant to be public and identifies the project; it does not
 * authorise anything. Writes are allowed or refused by the row-level security
 * policy at the provider. A service-role key would authorise everything and
 * must never be set here — see `docs/PUBLISHING.md`.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_BUCKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
