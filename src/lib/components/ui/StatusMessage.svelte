<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  /** Polite live-region status line under a form. */
  type Tone = 'success' | 'error' | 'info';

  interface Props {
    tone?: Tone;
    class?: string;
    children: Snippet;
  }

  let { tone = 'info', class: className, children }: Props = $props();

  const toneMap: Record<Tone, string> = {
    success: 'text-green font-semibold',
    error: 'text-green',
    info: 'text-deep/60'
  };
</script>

<p
  class={cn('type-caption', toneMap[tone], className)}
  role={tone === 'error' ? 'alert' : 'status'}
  aria-live="polite"
>
  {@render children()}
</p>
