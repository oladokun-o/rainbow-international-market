<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  /**
   * Standard content section shell — consistent max-width/padding instead
   * of every page repeating `px-6 py-14 sm:py-20 lg:px-12` and
   * `mx-auto max-w-6xl` by hand. `pattern` is a low-opacity repeating
   * brand-tile background, kept faint (4-7%) the same way decorative motifs
   * are — not a full-strength reproduction of a print asset.
   */
  type Tone = 'cream' | 'green' | 'white' | 'deep';

  interface Props {
    tone?: Tone;
    pattern?: boolean;
    /** Anchor target, e.g. for a footer link jumping to a specific section. */
    id?: string;
    class?: string;
    innerClass?: string;
    children: Snippet;
  }

  let {
    tone = 'cream',
    pattern = false,
    id,
    class: className,
    innerClass,
    children
  }: Props = $props();

  const toneClass: Record<Tone, string> = {
    cream: '',
    green: 'bg-green',
    white: 'bg-white/40',
    deep: 'bg-deep'
  };
</script>

<section
  {id}
  class={cn(
    'relative overflow-hidden px-6 py-14 sm:py-20 lg:px-12',
    id && 'scroll-mt-20',
    toneClass[tone],
    className
  )}
>
  {#if pattern}
    <div
      class="pointer-events-none absolute inset-0 opacity-5"
      style="background-image: url('/brand/logo-pattern.svg'); background-repeat: repeat; background-size: 220px auto;"
      aria-hidden="true"
    ></div>
  {/if}
  <div class={cn('relative mx-auto max-w-6xl', innerClass)}>
    {@render children()}
  </div>
</section>
