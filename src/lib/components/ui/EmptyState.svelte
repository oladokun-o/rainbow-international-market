<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  /**
   * Whatever screen has nothing to show yet reaches for this — empty cart,
   * no search results, no orders yet. Generic by design.
   */
  interface Props {
    message: string;
    hint?: string;
    /** Motif SVG shown faded behind the message; omit for a plain empty state. */
    motifSrc?: string;
    class?: string;
    children?: Snippet;
  }

  let { message, hint, motifSrc, class: className, children }: Props = $props();
</script>

<div
  class={cn(
    'relative flex flex-col items-center gap-2 overflow-hidden rounded-surface border-2 border-deep/10 bg-white/40 px-6 py-12 text-center',
    className
  )}
>
  {#if motifSrc}
    <img
      src={motifSrc}
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 m-auto w-40 opacity-[0.06]"
    />
  {/if}
  <p class="relative text-[15px] font-semibold text-deep">{message}</p>
  {#if hint}
    <p class="type-caption relative text-deep/50">{hint}</p>
  {/if}
  {#if children}
    <div class="relative mt-2">
      {@render children()}
    </div>
  {/if}
</div>
