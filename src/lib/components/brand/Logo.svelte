<script lang="ts">
  /**
   * The Rainbow International Market logo, from the client brand pack.
   *   variant — wordmark (default, "RAINBOW / INTERNATIONAL MARKET" lockup)
   *           | mark (the rainbow-arc / Africa / basket icon)
   *           | stacked (mark above the wordmark)
   *   tone    — color (default: full-colour vector) | white | green
   *             (white / green are flat PNG monochromes for use on a
   *              coloured or photographic background)
   */
  type Variant = 'wordmark' | 'mark' | 'stacked';
  type Tone = 'color' | 'white' | 'green';

  interface Props {
    variant?: Variant;
    tone?: Tone;
    /** Rendered height in px; width follows the variant's aspect ratio. */
    height?: number;
    assetBase?: string;
    /** Wraps the mark in a labelled link. */
    href?: string;
    class?: string;
    /** Applied to the <img> — e.g. a responsive `h-6 sm:h-8 w-auto`. */
    imgClass?: string;
  }

  let {
    variant = 'wordmark',
    tone = 'color',
    height = 32,
    assetBase = '/brand',
    href,
    class: className,
    imgClass
  }: Props = $props();

  // width ÷ height, from each source file's viewBox.
  const RATIO: Record<Variant, number> = {
    wordmark: 2048 / 736,
    mark: 1995 / 2048,
    stacked: 780 / 611
  };

  const width = $derived(Math.round(height * RATIO[variant]));
  const src = $derived(
    tone === 'color'
      ? `${assetBase}/logo-${variant}-vector.svg`
      : `${assetBase}/logo-${variant}-${tone}.png`
  );
</script>

{#if href}
  <a {href} aria-label="Rainbow International Market home" class={className}>
    <img {src} {width} {height} alt="Rainbow International Market" class={imgClass} />
  </a>
{:else}
  <img {src} {width} {height} alt="Rainbow International Market" class={imgClass ?? className} />
{/if}
