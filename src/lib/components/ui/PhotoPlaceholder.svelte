<script lang="ts">
  import { cn } from '$lib/utils';

  /**
   * Diagonal-stripe placeholder for an image slot with no real photo yet —
   * a subtle, brand-tinted treatment (a repeating diagonal gradient plus a
   * small uppercase label naming what belongs there, e.g. "Product photo").
   * Ships as-is until real photography exists — swapping in a real photo
   * later is just rendering an `<img>` instead of this component.
   */
  interface Props {
    /** What belongs in this slot, e.g. "Product photo". */
    label?: string;
    class?: string;
  }

  let { label, class: className }: Props = $props();
</script>

<div
  class={cn('flex items-center justify-center text-center type-overline text-deep/40', className)}
  style="background-image: repeating-linear-gradient(135deg, rgba(18, 53, 31, 0.07) 0 10px, rgba(18, 53, 31, 0.03) 10px 20px);"
  aria-hidden="true"
>
  {#if label}
    <span>{label}</span>
  {/if}
</div>
