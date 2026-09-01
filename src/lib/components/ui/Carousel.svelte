<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { EmblaOptionsType, EmblaCarouselType, EmblaPluginType } from 'embla-carousel';
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  import { cn } from '$lib/utils';
  import IconButton from './IconButton.svelte';

  /**
   * Drag/swipe-and-snap row for product cards, galleries, and anything else
   * that needs "moving cards" — one shared carousel, not a per-page
   * reimplementation. Each slide (a direct child rendered via `children`)
   * should size itself (e.g. `w-64 shrink-0`); this component only owns
   * the scroll/drag/snap mechanics and the prev/next controls.
   */
  interface Props {
    options?: EmblaOptionsType;
    plugins?: EmblaPluginType[];
    class?: string;
    children: Snippet;
  }

  let {
    options = { align: 'start', dragFree: true },
    plugins = [],
    class: className,
    children
  }: Props = $props();

  let api: EmblaCarouselType | null = null;
  let canPrev = $state(false);
  let canNext = $state(false);

  function update() {
    if (!api) return;
    canPrev = api.canScrollPrev();
    canNext = api.canScrollNext();
  }

  function onInit(event: CustomEvent<EmblaCarouselType>) {
    api = event.detail;
    update();
    api.on('select', update);
    api.on('reInit', update);
  }
</script>

<div class={cn('relative', className)}>
  <div class="overflow-hidden" use:emblaCarouselSvelte={{ options, plugins }} onemblaInit={onInit}>
    <div class="flex gap-4">
      {@render children()}
    </div>
  </div>
  {#if canPrev || canNext}
    <div class="mt-4 flex justify-end gap-2">
      <IconButton
        icon="chevron-left"
        label="Previous"
        variant="outline"
        disabled={!canPrev}
        onclick={() => api?.scrollPrev()}
      />
      <IconButton
        icon="chevron-right"
        label="Next"
        variant="outline"
        disabled={!canNext}
        onclick={() => api?.scrollNext()}
      />
    </div>
  {/if}
</div>
