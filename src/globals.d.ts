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
