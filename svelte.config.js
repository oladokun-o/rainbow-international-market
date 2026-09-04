import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x'
    }),
    // Kit auto-registers src/service-worker.ts on every page load by default,
    // in dev too — that fights Vite HMR (stale SW caches serve stale CSS a
    // few seconds after load). +layout.svelte already registers it manually,
    // gated on `!dev`, so disable Kit's own registration entirely.
    serviceWorker: { register: false },
    // @sanity/sveltekit only declares one export condition ("."): a barrel
    // file that re-exports PreviewMode/QueryLoader/VisualEditing/createClient
    // alongside SanityStudio — which statically imports the whole `sanity`
    // Studio package, including its global, UNLAYERED CSS (sanity/lib/
    // bundle.css, @sanity/ui, a 165KB ui5/dist/styles.css). Vite dev mode
    // serves ESM without tree-shaking, so importing anything from the barrel
    // executes all of it — that Studio CSS was landing on every route (not
    // just /studio), silently beating every Tailwind @layer utilities rule
    // (unlayered CSS always wins over layered CSS, regardless of
    // specificity). These aliases resolve straight to the concrete submodule
    // files, bypassing the package's "exports" map (which doesn't declare
    // deep subpaths, so a plain deep import is rejected), so app code only
    // pulls in what it actually uses. `kit.alias` (rather than a bare Vite
    // resolve.alias) keeps svelte-check's TypeScript resolution in sync too.
    // .js targets are deliberately extension-less: TypeScript only picks up
    // the sibling .d.ts declaration file (e.g. client/index.d.ts) when it has
    // to resolve the extension itself, not when a path mapping points at the
    // literal .js file. The .svelte targets keep their extension since
    // svelte-check needs it to recognize them as components.
    alias: {
      '@sanity/sveltekit/client': 'node_modules/@sanity/sveltekit/dist/client/index',
      '@sanity/sveltekit/groq': 'node_modules/@sanity/sveltekit/dist/groq/index',
      '@sanity/sveltekit/preview': 'node_modules/@sanity/sveltekit/dist/preview/PreviewMode.svelte',
      '@sanity/sveltekit/preview-handler':
        'node_modules/@sanity/sveltekit/dist/preview/handlePreviewMode',
      '@sanity/sveltekit/query': 'node_modules/@sanity/sveltekit/dist/query/QueryLoader.svelte',
      '@sanity/sveltekit/query-handler':
        'node_modules/@sanity/sveltekit/dist/query/handleQueryLoader',
      '@sanity/sveltekit/query-store':
        'node_modules/@sanity/sveltekit/dist/query/store/createQueryStore',
      '@sanity/sveltekit/visual-editing':
        'node_modules/@sanity/sveltekit/dist/visual-editing/VisualEditing.svelte'
    }
  }
};

export default config;
