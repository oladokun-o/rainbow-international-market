// Server-only Sanity client — carries the read token, no CDN, stega on.
// Follows the Sanity SvelteKit integration guide (client.server.ts snippet).
// The token env var has NO PUBLIC_ prefix and must never reach the browser.
import { SANITY_API_READ_TOKEN } from '$env/static/private';
import { client } from '$lib/sanity/client';

export const serverClient = client.withConfig({
  token: SANITY_API_READ_TOKEN,
  useCdn: false,
  stega: true
});
