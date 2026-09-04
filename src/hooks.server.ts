// Sanity server wiring — per the Sanity SvelteKit integration guide.
// `setServerClient` registers the token-bearing client for `locals.sanity`;
// `handlePreviewMode` powers draft/visual-editing preview; `handleQueryLoader`
// hydrates `useQuery` results on the client.
// Deep-imported (see the alias comment in vite.config.ts) instead of the
// `'@sanity/sveltekit'` barrel: this hooks module runs on every request, and
// the barrel's CSS side-effects (from its SanityStudio re-export) were
// leaking Studio-global CSS into every page's SSR module graph.
import { handlePreviewMode } from '@sanity/sveltekit/preview-handler';
import { handleQueryLoader } from '@sanity/sveltekit/query-handler';
import { setServerClient } from '@sanity/sveltekit/query-store';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { serverClient } from '$lib/sanity/client.server';

setServerClient(serverClient);

export const handle = sequence(
  handlePreviewMode({
    client: serverClient,
    preview: { redirect }
  }),
  handleQueryLoader()
);
