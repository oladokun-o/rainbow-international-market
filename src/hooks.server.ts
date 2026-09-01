// Sanity server wiring — per the Sanity SvelteKit integration guide.
// `setServerClient` registers the token-bearing client for `locals.sanity`;
// `handlePreviewMode` powers draft/visual-editing preview; `handleQueryLoader`
// hydrates `useQuery` results on the client.
import { handlePreviewMode, handleQueryLoader, setServerClient } from '@sanity/sveltekit';
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
