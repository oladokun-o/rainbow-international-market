<script lang="ts">
  import '../app.css';
  // Self-hosted variable font for body/UI text. The display font is currently
  // the same stack (placeholder) pending the client's brand typeface.
  import '@fontsource-variable/inter';
  import type { Snippet } from 'svelte';
  import { onNavigate } from '$app/navigation';
  import favicon from '$lib/assets/favicon.svg';
  import Toast from '$lib/components/ui/Toast.svelte';

  let { children }: { children: Snippet } = $props();

  // TODO(phase 3): wrap {@render children()} in the Sanity preview providers
  // (<PreviewMode><VisualEditing><QueryLoader>).

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

{@render children()}

<Toast />
