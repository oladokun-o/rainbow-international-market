<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  /**
   * The system's base surface: translucent white on cream, hairline deep
   * border, no shadow — only floating things (modals, dropdowns) get one.
   */
  type Tone = 'default' | 'strong' | 'green' | 'deep' | 'outline';
  type Padding = 'none' | 'sm' | 'md' | 'lg';
  /** card = 16px (default), nested = 12px inside another card, panel = 24px for marketing blocks. */
  type Radius = 'card' | 'nested' | 'panel';

  interface Props {
    tone?: Tone;
    padding?: Padding;
    radius?: Radius;
    as?: keyof HTMLElementTagNameMap;
    class?: string;
    children: Snippet;
  }

  let {
    tone = 'default',
    padding = 'md',
    radius = 'card',
    as = 'div',
    class: className,
    children
  }: Props = $props();

  const toneMap: Record<Tone, string> = {
    default: 'bg-white/50 border-2 border-deep/10 text-deep',
    strong: 'bg-white/80 border-2 border-deep/20 text-deep',
    green: 'bg-green border-2 border-transparent text-cream',
    deep: 'bg-deep border-2 border-transparent text-cream',
    outline: 'bg-transparent border-2 border-deep text-deep'
  };

  const paddingMap: Record<Padding, string> = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const radiusMap: Record<Radius, string> = {
    card: 'rounded-2xl',
    nested: 'rounded-xl',
    panel: 'rounded-3xl'
  };

  const classes = $derived(
    cn('box-border', toneMap[tone], paddingMap[padding], radiusMap[radius], className)
  );
</script>

<svelte:element this={as} class={classes}>
  {@render children()}
</svelte:element>
