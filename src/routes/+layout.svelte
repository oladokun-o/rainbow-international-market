<script lang="ts">
  import '../app.css';
  // Self-hosted brand fonts: Outfit (display) + DM Sans (body).
  import '@fontsource-variable/outfit';
  import '@fontsource-variable/dm-sans';
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { onNavigate } from '$app/navigation';
  // Deep-imported instead of `from '@sanity/sveltekit'` — see the comment in
  // $lib/sanity/client.ts. The barrel also re-exports SanityStudio, which
  // pulls in the whole Studio bundle's global CSS on every route in dev.
  import PreviewMode from '@sanity/sveltekit/preview';
  import QueryLoader from '@sanity/sveltekit/query';
  import VisualEditing from '@sanity/sveltekit/visual-editing';
  import { client } from '$lib/sanity/client';
  import Toast from '$lib/components/ui/Toast.svelte';
  import type { LayoutProps } from './$types';

  const { children, data }: LayoutProps = $props();
  // svelte-ignore state_referenced_locally
  const { previewEnabled } = data;

  // App-like page transitions via the View Transitions API. Progressive
  // enhancement — a no-op in browsers that don't support it, and skipped
  // outright for reduced-motion (the crossfade keyframes in app.css are also
  // guarded, but not calling startViewTransition at all here means
  // reduced-motion users get an instant swap, not a near-instant one).
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  // Register the PWA service worker (production only — it fights Vite HMR in dev).
  onMount(() => {
    if (!dev && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        /* offline support is best-effort */
      });
    }
  });
</script>

<PreviewMode enabled={previewEnabled}>
  <VisualEditing enabled={previewEnabled}>
    <QueryLoader enabled={previewEnabled} {client}>
      {@render children()}
    </QueryLoader>
  </VisualEditing>
</PreviewMode>

<Toast />
