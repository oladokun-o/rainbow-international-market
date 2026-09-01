// Public Sanity client — safe for the browser: no token, CDN-backed.
// Follows the Sanity SvelteKit integration guide (client.ts snippet).
import { createClient } from '@sanity/sveltekit';
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
