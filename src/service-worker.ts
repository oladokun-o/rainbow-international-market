/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `rim-cache-${version}`;
// Hashed build output is immutable; a curated slice of static files is worth
// pre-caching too. Everything else is cached on demand, network-first.
const PRECACHE = [...build, ...files.filter((f) => /\.(svg|png|ico|webmanifest|woff2?)$/.test(f))];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => sw.clients.claim())
  );
});

// Never let the worker intercept the CMS, the admin area, or API calls —
// those must always hit the network.
function isBypassed(url: URL): boolean {
  return (
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/')
  );
}

sw.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  if (url.origin === location.origin && isBypassed(url)) return;

  // Immutable build assets — cache-first.
  if (url.origin === location.origin && build.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => hit ?? fetch(request))
    );
    return;
  }

  // Pages, Sanity images, fonts — network-first, fall back to cache.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && (url.origin === location.origin || url.hostname.endsWith('.sanity.io'))) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        // A navigation with nothing cached — serve the app shell if we have it.
        if (request.mode === 'navigate') {
          const shell = await caches.match('/');
          if (shell) return shell;
        }
        return new Response('Offline', { status: 503, headers: { 'content-type': 'text/plain' } });
      })
  );
});
