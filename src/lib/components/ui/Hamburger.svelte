<script lang="ts">
  import { scale } from 'svelte/transition';
  import { Menu, X } from '@lucide/svelte';

  interface Props {
    mobileMenuState: boolean;
    onMenuClick?: () => void;
  }

  let { mobileMenuState, onMenuClick }: Props = $props();

  let mobileMenuOpen = $derived(mobileMenuState);
</script>

<button
  type="button"
  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={mobileMenuOpen}
  onclick={onMenuClick}
  class="grid size-9 place-items-center text-deep sm:hidden"
>
  <span class="relative block size-6">
    {#if mobileMenuOpen}
      <span
        class="absolute inset-0 grid place-items-center"
        in:scale={{ duration: 200, start: 0.5, opacity: 0 }}
        out:scale={{ duration: 150, start: 0.5, opacity: 0 }}
      >
        <X size={24} strokeWidth={2} aria-hidden="true" />
      </span>
    {:else}
      <span
        class="absolute inset-0 grid place-items-center"
        in:scale={{ duration: 200, start: 0.5, opacity: 0 }}
        out:scale={{ duration: 150, start: 0.5, opacity: 0 }}
      >
        <Menu size={24} strokeWidth={2} aria-hidden="true" />
      </span>
    {/if}
  </span>
</button>
