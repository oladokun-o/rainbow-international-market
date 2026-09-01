<script lang="ts">
  import { scale } from 'svelte/transition';

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
      <svg
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="none"
        aria-hidden="true"
        in:scale={{ duration: 200, start: 0.5, opacity: 0 }}
        out:scale={{ duration: 150, start: 0.5, opacity: 0 }}
        class="absolute inset-0"
      >
        <path
          d="M0 0H3.76119L12 6.76744L20.4179 0H24V1.11628L14.5075 8.86047L24 16.4651V18H20.4179L12 10.814L3.76119 18H0V16.4651L9.22388 8.86047L0 1.11628V0Z"
          fill="currentColor"
        />
      </svg>
    {:else}
      <svg
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="none"
        aria-hidden="true"
        in:scale={{ duration: 200, start: 0.5, opacity: 0 }}
        out:scale={{ duration: 150, start: 0.5, opacity: 0 }}
        class="absolute inset-0"
      >
        <path d="M0 0H24V1.0625L20.7914 4H0V0Z" fill="currentColor" />
        <path d="M0 7H24V8.0625L20.7914 11H0V7Z" fill="currentColor" />
        <path d="M0 14H24V15.0625L20.7914 18H0V14Z" fill="currentColor" />
      </svg>
    {/if}
  </span>
</button>
