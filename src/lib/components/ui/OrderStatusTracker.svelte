<script lang="ts">
  import { cn } from '$lib/utils';
  import Icon from './Icon.svelte';

  export interface OrderStage {
    label: string;
    /** Timestamp or note under the label, e.g. "11:42 AM". */
    detail?: string;
  }

  /** Order progress rail for the order-status screen. */
  interface Props {
    stages: OrderStage[];
    /** Zero-based index of the stage in progress. */
    current?: number;
    /** horizontal for a wide status page, vertical for a narrow drawer. */
    orientation?: 'horizontal' | 'vertical';
    class?: string;
  }

  let { stages, current = 0, orientation = 'horizontal', class: className }: Props = $props();
  const vertical = $derived(orientation === 'vertical');
</script>

<ol
  class={cn('m-0 flex list-none p-0', vertical ? 'flex-col gap-0' : 'items-start gap-2', className)}
>
  {#each stages as stage, i (stage.label)}
    {@const done = i < current}
    {@const active = i === current}
    <li
      class={cn(
        'flex min-w-0',
        vertical
          ? 'flex-row items-start gap-3 py-1'
          : 'flex-1 flex-col items-center gap-2 text-center'
      )}
    >
      <div class={cn('flex items-center', vertical ? 'flex-col' : 'w-full')}>
        <span
          aria-current={active ? 'step' : undefined}
          class={cn(
            'grid size-8 shrink-0 place-items-center rounded-full border-2 text-[13px] font-bold',
            done
              ? 'border-green bg-green text-cream'
              : active
                ? 'border-green bg-white/70 text-green'
                : 'border-deep/25 bg-transparent text-deep/40'
          )}
        >
          {#if done}
            <Icon name="check" size={15} strokeWidth={3} />
          {:else}
            {i + 1}
          {/if}
        </span>
        {#if i < stages.length - 1}
          <span
            aria-hidden="true"
            class={cn(
              'rounded-full transition-colors duration-slow',
              done ? 'bg-green' : 'bg-deep/20',
              vertical ? 'my-1 h-8 w-0.5' : 'mx-1 h-0.5 flex-1 self-center'
            )}
          ></span>
        {/if}
      </div>
      <div class={cn('flex flex-col', vertical ? 'pt-1' : 'items-center')}>
        <span class={cn('type-overline', active || done ? 'text-deep' : 'text-deep/40')}>
          {stage.label}
        </span>
        {#if stage.detail}
          <span class="type-caption text-deep/50">{stage.detail}</span>
        {/if}
      </div>
    </li>
  {/each}
</ol>
