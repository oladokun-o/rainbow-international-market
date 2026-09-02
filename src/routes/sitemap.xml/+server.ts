import { serverClient } from '$lib/sanity/client.server';
import type { RequestHandler } from './$types';

// Public, indexable routes only. The order flow, tracking, and account-ish
// pages are all noindex, so they don't belong here.
const STATIC_PATHS = ['/', '/shop', '/about', '/contact'];

export const GET: RequestHandler = async ({ url, setHeaders }) => {
  setHeaders({ 'cache-control': 'max-age=3600', 'content-type': 'application/xml' });
  const origin = url.origin;

  let slugs: string[] = [];
  try {
    slugs = await serverClient.fetch<string[]>(
      `*[_type == "product" && defined(slug.current)].slug.current`
    );
  } catch {
    slugs = [];
  }

  const paths = [...STATIC_PATHS, ...slugs.map((s) => `/shop/${s}`)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
    .map(
      (p) =>
        `  <url><loc>${origin}${p}</loc><changefreq>${p === '/' || p === '/shop' ? 'daily' : 'weekly'}</changefreq></url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(body);
};
