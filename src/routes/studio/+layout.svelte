<script lang="ts">
  // Bare passthrough — the embedded Studio owns the whole viewport and must
  // not inherit the storefront Header/Footer.
  import type { Snippet } from 'svelte';
  const { children }: { children: Snippet } = $props();
</script>

{@render children()}
