<script lang="ts">
  /**
   * The horizontal Rainbow wordmark, rendered from an SVG asset.
   * Placeholder wordmark — replace with the real brand lockup when delivered.
   */
  interface Props {
    /** green on cream surfaces, cream on green or deep surfaces. */
    tone?: 'green' | 'cream';
    /** Rendered height in px; width follows the 555:94 ratio. */
    height?: number;
    assetBase?: string;
    /** Wraps the mark in a labelled link. */
    href?: string;
    /** Applied to the wrapping <a> when `href` is set, else ignored. */
    class?: string;
    /** Applied to the <img> itself — e.g. a responsive `h-8 sm:h-10 w-auto`
     * override, which wins visually over the `height`/`width` attributes
     * while they still hold the layout's aspect ratio before CSS loads. */
    imgClass?: string;
  }

  let {
    tone = 'green',
    height = 40,
    assetBase = '/brand',
    href,
    class: className,
    imgClass
  }: Props = $props();

  const width = $derived(Math.round((height * 555) / 94));
  const src = $derived(`${assetBase}/logo-horizontal-${tone}.svg`);
</script>

{#if href}
  <a {href} aria-label="Rainbow International Market home" class={className}>
    <img {src} {width} {height} alt="Rainbow International Market" class={imgClass} />
  </a>
{:else}
  <img {src} {width} {height} alt="Rainbow International Market" class={imgClass ?? className} />
{/if}
