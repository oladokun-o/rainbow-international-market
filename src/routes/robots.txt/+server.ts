import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, setHeaders }) => {
  setHeaders({ 'cache-control': 'max-age=3600', 'content-type': 'text/plain' });
  return new Response(
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /studio
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /confirmation
Disallow: /my-orders
Disallow: /track/

Sitemap: ${url.origin}/sitemap.xml
`
  );
};
