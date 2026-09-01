<script lang="ts">
  import { cn } from '$lib/utils';

  /** A trail of steps back to Home. The last item is always the current
   * page — bold display type, not a link (nowhere useful to send someone
   * already there). Every earlier item should have an `href`; one without is
   * just rendered as inert text (a step that genuinely has nowhere to link
   * back to, rather than a broken link). */
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
  <ol class="flex items-center gap-2 whitespace-nowrap">
    {#each items as item, i (item.label)}
      {#if i > 0}
        <li aria-hidden="true" class="size-1 shrink-0 rounded-full bg-green"></li>
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
            class="font-display text-[15px] tracking-wide text-green uppercase relative -bottom-0.5"
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
