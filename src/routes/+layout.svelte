<script lang="ts">
  import '../app.css';
  // Self-hosted variable font for body/UI text. The display font is currently
  // the same stack (placeholder) pending the client's brand typeface.
  import '@fontsource-variable/inter';
  import { onNavigate } from '$app/navigation';
  import { PreviewMode, QueryLoader, VisualEditing } from '@sanity/sveltekit';
  import { client } from '$lib/sanity/client';
  import favicon from '$lib/assets/favicon.svg';
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

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<PreviewMode enabled={previewEnabled}>
  <VisualEditing enabled={previewEnabled}>
    <QueryLoader enabled={previewEnabled} {client}>
      {@render children()}
    </QueryLoader>
  </VisualEditing>
</PreviewMode>

<Toast />
