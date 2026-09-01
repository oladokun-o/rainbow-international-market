<script lang="ts">
  import { cn } from '$lib/utils';
  import Icon from './Icon.svelte';

  /** Numbered progress rail for multi-step forms (checkout). */
  interface Props {
    steps: string[];
    /** Zero-based index of the step in progress. */
    current?: number;
    class?: string;
  }

  let { steps, current = 0, class: className }: Props = $props();
</script>

<ol class={cn('m-0 flex list-none items-center gap-2 p-0', className)}>
  {#each steps as label, i (label)}
    {@const done = i < current}
    {@const active = i === current}
    <li
      class={cn('flex min-w-0 items-center gap-2', i === steps.length - 1 ? 'flex-none' : 'flex-1')}
    >
      <span
        aria-current={active ? 'step' : undefined}
        class={cn(
          'grid size-7 shrink-0 place-items-center rounded-full border-2 text-[12px] font-bold',
          done
            ? 'border-green bg-green text-cream'
            : active
              ? 'border-green bg-white/60 text-green'
              : 'border-deep/25 bg-transparent text-deep/40'
        )}
      >
        {#if done}
          <Icon name="check" size={13} strokeWidth={3} />
        {:else}
          {i + 1}
        {/if}
      </span>
      <span
        class={cn(
          'type-overline truncate whitespace-nowrap',
          active ? 'text-deep' : 'text-deep/40'
        )}
      >
        {label}
      </span>
      {#if i < steps.length - 1}
        <span
          aria-hidden="true"
          class={cn('h-0.5 min-w-4 flex-1 rounded-full', done ? 'bg-green' : 'bg-deep/20')}
        ></span>
      {/if}
    </li>
  {/each}
</ol>
