<script lang="ts">
  import '../app.css';
  // Self-hosted variable font for body/UI text. The display font is currently
  // the same stack (placeholder) pending the client's brand typeface.
  import '@fontsource-variable/inter';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

  // TODO(phase 2/3): View-transition onNavigate crossfade + Sanity preview
  // providers wrapper go here.
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
