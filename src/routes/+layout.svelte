<script lang="ts">
  import '../app.css';
  // Self-hosted brand fonts: Outfit (display) + DM Sans (body).
  import '@fontsource-variable/outfit';
  import '@fontsource-variable/dm-sans';
  import { onNavigate } from '$app/navigation';
  import { PreviewMode, QueryLoader, VisualEditing } from '@sanity/sveltekit';
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
</script>

<PreviewMode enabled={previewEnabled}>
  <VisualEditing enabled={previewEnabled}>
    <QueryLoader enabled={previewEnabled} {client}>
      {@render children()}
    </QueryLoader>
  </VisualEditing>
</PreviewMode>

<Toast />
