<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  /** Uppercase pill label: product tags, order states, admin table status cells. */
  type Tone =
    | 'green'
    | 'deep'
    | 'orange'
    | 'outline'
    | 'success'
    | 'error'
    | 'warning'
    | 'progress';
  type Size = 'sm' | 'md';

  interface Props {
    tone?: Tone;
    size?: Size;
    class?: string;
    children: Snippet;
  }

  let { tone = 'outline', size = 'md', class: className, children }: Props = $props();

  const toneMap: Record<Tone, string> = {
    green: 'bg-green text-cream',
    deep: 'bg-deep text-cream',
    orange: 'bg-orange text-deep',
    outline: 'bg-transparent border-2 border-deep text-deep',
    success: 'bg-green/10 text-green',
    error: 'bg-green/10 text-green',
    warning: 'bg-orange/20 text-deep',
    progress: 'bg-orange/10 text-orange'
  };

  const sizeMap: Record<Size, string> = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-[13px]'
  };

  const classes = $derived(
    cn(
      'inline-flex items-center gap-1.5 rounded-control font-semibold uppercase tracking-wide whitespace-nowrap',
      toneMap[tone],
      sizeMap[size],
      className
    )
  );
</script>

<span class={classes}>
  {@render children()}
</span>
