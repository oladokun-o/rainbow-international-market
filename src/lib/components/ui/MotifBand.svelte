<script lang="ts">
  import { cn } from '$lib/utils';

  /** Thin decorative strip under the header — three brand-colored arcs,
   * low-contrast on purpose. Site-wide on every `(app)` page. */
  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();
</script>

<div class={cn('flex justify-center px-4 py-2 opacity-70', className)} aria-hidden="true">
  <svg viewBox="0 0 320 14" class="h-3 w-full max-w-xs" fill="none">
    <path
      d="M10 12C70 4 250 4 310 12"
      stroke="var(--color-orange)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="2 6"
    />
    <path
      d="M10 8C70 1 250 1 310 8"
      stroke="var(--color-yellow)"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M10 4C70 -2 250 -2 310 4"
      stroke="var(--color-green)"
      stroke-width="2.5"
      stroke-linecap="round"
    />
  </svg>
</div>
