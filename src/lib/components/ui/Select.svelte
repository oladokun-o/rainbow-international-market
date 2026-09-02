<script lang="ts">
  import { cn } from '$lib/utils';
  import { dropdownMenu } from '$lib/motion';
  import { ChevronDown } from '@lucide/svelte';

  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    options: Option[];
    /** Bound selected value. Empty string means "nothing chosen yet". */
    value?: string;
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    /** Accessible label for the listbox (e.g. "Category"). */
    ariaLabel?: string;
    class?: string;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Choose one…',
    id,
    disabled = false,
    ariaLabel,
    class: className
  }: Props = $props();

  let open = $state(false);
  let highlighted = $state(-1);
  let root = $state<HTMLDivElement | null>(null);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let listEl = $state<HTMLUListElement | null>(null);

  /**
   * The open list uses fixed positioning measured from the trigger, so it
   * can escape clipping ancestors (table wrappers with overflow-x-auto,
   * modal bodies with overflow-auto). Recomputed on open; scrolling or
   * resizing closes the list rather than chasing the trigger around.
   */
  let listStyle = $state('');

  function positionList() {
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const maxHeight = 240; // matches max-h-60
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < maxHeight + 16 && rect.top > spaceBelow;
    const vertical = openUp
      ? `bottom: ${window.innerHeight - rect.top + 8}px;`
      : `top: ${rect.bottom + 8}px;`;
    listStyle = `position: fixed; left: ${rect.left}px; width: ${rect.width}px; ${vertical}`;
  }

  const selectedIndex = $derived(options.findIndex((o) => o.value === value));
  const selectedLabel = $derived(selectedIndex >= 0 ? options[selectedIndex].label : '');
  const listId = $derived(id ? `${id}-listbox` : undefined);

  function optionId(i: number): string | undefined {
    return id ? `${id}-opt-${i}` : undefined;
  }

  function openList() {
    if (disabled) return;
    positionList();
    open = true;
    highlighted = selectedIndex >= 0 ? selectedIndex : 0;
    queueMicrotask(scrollHighlightedIntoView);
  }

  function closeList() {
    open = false;
    highlighted = -1;
  }

  function choose(i: number) {
    const opt = options[i];
    if (!opt) return;
    value = opt.value;
    closeList();
  }

  function scrollHighlightedIntoView() {
    if (!listEl || highlighted < 0) return;
    const node = listEl.children[highlighted] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }

  function move(delta: number) {
    if (!open) {
      openList();
      return;
    }
    const count = options.length;
    if (count === 0) return;
    highlighted = (highlighted + delta + count) % count;
    scrollHighlightedIntoView();
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          highlighted = 0;
          scrollHighlightedIntoView();
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          highlighted = options.length - 1;
          scrollHighlightedIntoView();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open && highlighted >= 0) choose(highlighted);
        else openList();
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          closeList();
        }
        break;
      case 'Tab':
        if (open) closeList();
        break;
    }
  }

  // Close when focus or a click leaves the component, and on scroll/resize
  // (the fixed-positioned list would otherwise detach from its trigger).
  $effect(() => {
    if (!open) return;
    const onPointerDown = (ev: MouseEvent) => {
      const target = ev.target as Node;
      if (root && !root.contains(target) && listEl && !listEl.contains(target)) closeList();
    };
    const onFocusIn = (ev: FocusEvent) => {
      const target = ev.target as Node;
      if (root && !root.contains(target) && listEl && !listEl.contains(target)) closeList();
    };
    const onScroll = (ev: Event) => {
      // Scrolling inside the list itself is fine; anything else closes.
      if (listEl && ev.target instanceof Node && listEl.contains(ev.target)) return;
      closeList();
    };
    const onResize = () => closeList();
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  });

  const triggerClass = $derived(
    cn(
      'flex w-full items-center justify-between gap-2 rounded-2xl border-2 border-deep/15 bg-white/70',
      'px-4 py-3 text-left font-body text-[15px] text-deep transition-colors',
      'focus:outline-none focus:border-deep disabled:cursor-not-allowed disabled:opacity-60',
      open && 'border-deep',
      className
    )
  );
</script>

<div bind:this={root} class="relative">
  <button
    {id}
    bind:this={triggerEl}
    type="button"
    {disabled}
    class={triggerClass}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={open ? listId : undefined}
    aria-label={ariaLabel}
    onclick={() => (open ? closeList() : openList())}
    onkeydown={onKeydown}
  >
    <span class={selectedLabel ? 'text-deep' : 'text-deep/40'}>
      {selectedLabel || placeholder}
    </span>
    <ChevronDown
      class="size-4 shrink-0 text-deep/50 transition-transform duration-200 {open
        ? 'rotate-180'
        : ''}"
      aria-hidden="true"
    />
  </button>

  {#if open}
    <ul
      bind:this={listEl}
      id={listId}
      role="listbox"
      aria-label={ariaLabel}
      tabindex="-1"
      style={listStyle}
      transition:dropdownMenu
      class="no-scrollbar z-50 max-h-60 overflow-auto rounded-2xl border-2
             border-deep/15 bg-cream/95 p-1.5 shadow-xl shadow-deep/10 backdrop-blur-sm"
    >
      {#each options as opt, i (opt.value)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          id={optionId(i)}
          role="option"
          aria-selected={value === opt.value}
          class={cn(
            'cursor-pointer rounded-xl px-3.5 py-2.5 text-[15px] transition-colors',
            i === highlighted ? 'bg-green text-cream' : 'text-deep hover:bg-deep/5',
            value === opt.value && i !== highlighted && 'font-semibold text-green'
          )}
          onpointerenter={() => (highlighted = i)}
          onpointerdown={(e) => e.preventDefault()}
          onclick={() => choose(i)}
        >
          {opt.label}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  /* Keep the option list scrollable but hide the scrollbar chrome. */
  .no-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* legacy Edge/IE */
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
</style>
