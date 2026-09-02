<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import Icon from './Icon.svelte';

  export interface AccordionItem {
    id: string;
    label: string;
  }

  /**
   * Generic expand/collapse rail — checkout steps, FAQ, product categories,
   * whatever a screen needs grouped and collapsible. Uses the
   * grid-template-rows 0fr→1fr technique so it animates height without a
   * fixed pixel guess.
   */
  interface Props {
    items: AccordionItem[];
    /** Ids of the currently open items. */
    open?: string[];
    onToggle?: (_id: string, _isOpen: boolean) => void;
    /** Allow more than one item open at once. */
    multiple?: boolean;
    content: Snippet<[AccordionItem]>;
    class?: string;
  }

  let {
    items,
    open = $bindable([]),
    onToggle,
    multiple = false,
    content,
    class: className
  }: Props = $props();

  function toggle(id: string) {
    const isOpen = open.includes(id);
    if (isOpen) {
      open = open.filter((openId) => openId !== id);
    } else {
      open = multiple ? [...open, id] : [id];
    }
    onToggle?.(id, !isOpen);
  }
</script>

<div class={cn('flex flex-col rounded-surface border-2 border-deep/10', className)}>
  {#each items as item, i (item.id)}
    {@const isOpen = open.includes(item.id)}
    <div class={i > 0 ? 'border-t-2 border-deep/10' : ''}>
      <button
        type="button"
        onclick={() => toggle(item.id)}
        aria-expanded={isOpen}
        class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] font-semibold text-deep"
      >
        {item.label}
        <span
          class="text-deep/50 transition-transform duration-fast"
          style={isOpen ? 'transform: rotate(180deg)' : undefined}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      <div
        class="grid transition-[grid-template-rows] duration-normal ease-out"
        style="grid-template-rows: {isOpen ? '1fr' : '0fr'};"
      >
        <div class="overflow-hidden">
          <div class="px-4 pb-4">
            {@render content(item)}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
