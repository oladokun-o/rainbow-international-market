import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/lib/sanity/schema';

// The Studio runs inside the Vite/SvelteKit client context, so it reads config
// from `import.meta.env` (PUBLIC_ vars are exposed to it via `envPrefix` in
// vite.config.ts) rather than SvelteKit's `$env` modules.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET as string;

export default defineConfig({
  name: 'rainbow-international-market',
  title: 'Rainbow International Market',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), ...(import.meta.env.DEV ? [visionTool()] : [])],
  schema: { types: schemaTypes }
});
