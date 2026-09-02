<script lang="ts">
  import { cn } from '$lib/utils';

  /**
   * Decorative repeating motif strip used as a section divider. Purely
   * decorative (`aria-hidden`) — never carries meaning on its own.
   *
   * Rainbow has no motif artwork yet, so this renders as a plain solid color
   * band (a thin orange strip by default). The API is kept intact so later
   * phases can drop in a real motif asset — restore the `background-image`
   * line once `static/brand/motif-*.svg` exists.
   */
  type Motif =
    | 'green-solid'
    | 'green-outline'
    | 'deep-solid'
    | 'cream-solid'
    | 'orange-solid';

  interface Props {
    motif?: Motif;
    /** Strip height in px. */
    height?: number;
    /** Slow horizontal scroll. Honors prefers-reduced-motion automatically
     * via the global `.motif-scroll` animation. Inert until a real motif
     * asset exists (there is nothing to scroll on a solid band). */
    animated?: boolean;
    /** Band background color. Defaults to a translucent orange wash. */
    background?: string;
    assetBase?: string;
    class?: string;
  }

  let {
    motif = 'orange-solid',
    height = 56,
    background,
    class: className
  }: Props = $props();

  const style = $derived(`height:${height}px;` + (background ? `background-color:${background};` : ''));
</script>

<div
  class={cn('w-full', background ? '' : 'bg-orange/20', className)}
  {style}
  data-motif={motif}
  aria-hidden="true"
></div>
