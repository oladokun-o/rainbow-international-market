<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { fade } from 'svelte/transition';
  import { drawerSlide } from '$lib/motion';

  /**
   * Edge-panel slide-in: panel translateX 100% to 0, scrim fades in. Generic
   * enough for a cart drawer or a mobile nav drawer — whichever page reaches
   * for it.
   */
  interface Props {
    open: boolean;
    title: string;
    onclose: () => void;
    side?: 'left' | 'right';
    children: Snippet;
  }

  let { open, title, onclose, side = 'right', children }: Props = $props();

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
  <div class="fixed inset-0 z-50" role="presentation">
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-deep/50"
      transition:fade={{ duration: 200 }}
      onclick={onclose}
    ></div>
    <div
      class={cn(
        'absolute inset-y-0 flex w-full max-w-sm flex-col gap-3 bg-cream p-4 shadow-xl',
        side === 'right' ? 'right-0' : 'left-0'
      )}
      transition:drawerSlide={{ side }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div class="flex items-center justify-between gap-4">
        <h2 class="type-overline text-deep/70 truncate">{title}</h2>
        <button
          type="button"
          onclick={onclose}
          aria-label="Close"
          class="rounded-control px-3 py-1 text-deep/60 hover:bg-deep/10 hover:text-deep"
        >
          ✕
        </button>
      </div>
      <div class="min-h-0 flex-1 overflow-auto">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
