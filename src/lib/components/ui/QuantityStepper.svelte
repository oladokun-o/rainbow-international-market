<script lang="ts">
  import { cn } from '$lib/utils';
  import IconButton from './IconButton.svelte';

  /** Quantity control for product cards and cart lines. */
  interface Props {
    value?: number;
    min?: number;
    max?: number;
    onChange?: (_value: number) => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
    class?: string;
  }

  let {
    value = $bindable(1),
    min = 0,
    max = 99,
    onChange,
    size = 'md',
    disabled = false,
    class: className
  }: Props = $props();

  function step(delta: number) {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next === value) return;
    value = next;
    onChange?.(next);
  }
</script>

<div
  class={cn(
    'inline-flex items-center rounded-control border-2 border-deep/15 bg-white/60',
    size === 'sm' ? 'gap-1 p-0.5' : 'gap-1.5 p-1',
    className
  )}
>
  <IconButton
    icon="minus"
    label="Decrease quantity"
    variant="ghost"
    size={size === 'sm' ? 'sm' : 'md'}
    disabled={disabled || value <= min}
    onclick={() => step(-1)}
  />
  <span
    class={cn(
      'grid min-w-[1.5em] place-items-center font-semibold text-deep',
      size === 'sm' ? 'text-[13px]' : 'text-[15px]'
    )}
  >
    {value}
  </span>
  <IconButton
    icon="plus"
    label="Increase quantity"
    variant="ghost"
    size={size === 'sm' ? 'sm' : 'md'}
    disabled={disabled || value >= max}
    onclick={() => step(1)}
  />
</div>
