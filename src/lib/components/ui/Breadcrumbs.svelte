<script lang="ts">
  import { ChevronRight } from '@lucide/svelte';
  import { cn } from '$lib/utils';

  /** A trail of steps back to Home. The last item is the current page —
   * semibold, not a link (nowhere useful to send someone already there), and
   * truncated so a long product name can't push the trail off the row. Every
   * earlier item should have an `href`; one without is just rendered as inert
   * text (a step that genuinely has nowhere to link back to, rather than a
   * broken link). */
  interface Crumb {
    label: string;
    href?: string;
  }

  interface Props {
    items: Crumb[];
    class?: string;
  }

  let { items, class: className }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class={cn('overflow-x-auto', className)}>
  <ol class="flex items-center gap-1.5 whitespace-nowrap">
    {#each items as item, i (item.label)}
      {#if i > 0}
        <li aria-hidden="true" class="flex shrink-0 items-center">
          <ChevronRight size={14} class="text-deep/40" />
        </li>
      {/if}
      <li class="flex items-center">
        {#if item.href && i < items.length - 1}
          <a
            href={item.href}
            class="type-caption font-semibold text-deep/50 transition-colors hover:text-green"
          >
            {item.label}
          </a>
        {:else if i === items.length - 1}
          <span
            class="type-caption block max-w-[200px] truncate font-semibold text-green"
            aria-current="page"
          >
            {item.label}
          </span>
        {:else}
          <span class="type-caption font-semibold text-deep/50">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
