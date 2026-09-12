/*
 * Offline support for Lok Sewa Sathi.
 *
 * The app shell and its hashed assets are cached on first visit and served
 * cache-first afterwards, so a learner on a patchy connection can still read
 * notes and take practice tests. A new deployment gets a new CACHE version,
 * which drops the old caches on activation.
 *
 * PDFs published under materials/ are not in the shell — they are cached the
 * first time they are opened, by the runtime handler below, so a material only
 * takes up room on a device that has actually read it. The PDF viewer itself
 * is loaded the same way, on first open rather than on first visit, so its
 * megabyte and a half costs nothing to a candidate who never opens a file.
 * PDFs a learner adds themselves never come through here at all; they live in
 * IndexedDB.
 */
const CACHE = 'lok-sewa-sathi-v1';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only handle same-origin requests; fonts and anything external fall through.
  if (url.origin !== self.location.origin) return;

  // Navigations always resolve to the app shell so deep links work offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((cached) => cached || Response.error())),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
