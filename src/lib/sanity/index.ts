// Barrel for `$lib/sanity` — browser-safe modules only.
// The server client lives in `client.server.ts` and is imported directly where
// needed (hooks / *.server.ts), never through here.
export { client, projectId, dataset, apiVersion } from './client';
export { urlFor } from './image';
export * from './queries';
