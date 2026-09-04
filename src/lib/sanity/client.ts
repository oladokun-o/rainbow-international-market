// Public Sanity client — safe for the browser: no token, CDN-backed.
// Follows the Sanity SvelteKit integration guide (client.ts snippet).
// Deep-imports the client submodule instead of the package's barrel entry
// ('@sanity/sveltekit') — the barrel re-exports SanityStudio (which statically
// pulls in the whole `sanity` Studio package + its global CSS: sanity/lib/
// bundle.css, @sanity/ui, ui5). Vite dev mode doesn't tree-shake barrels, so
// importing anything from it — even just `createClient` — loaded that Studio
// CSS as unlayered <style> tags on every route, silently overriding every
// Tailwind @layer utilities rule (unlayered CSS always wins over layered CSS).
import { createClient } from '@sanity/sveltekit/client';
import {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_API_VERSION
} from '$env/static/public';

export const projectId = PUBLIC_SANITY_PROJECT_ID;
export const dataset = PUBLIC_SANITY_DATASET;
export const apiVersion = PUBLIC_SANITY_API_VERSION || '2026-05-15';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl: '/studio' }
});
