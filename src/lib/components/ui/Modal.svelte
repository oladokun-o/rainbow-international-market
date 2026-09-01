<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cn } from '$lib/utils';

  /**
   * size — sm (confirm dialogs), lg (forms / content-heavy views).
   * The dialog sizes to its content up to 85vh; anything taller scrolls.
   *
   * Below `sm:`, this renders as a bottom sheet (full-width, anchored to the
   * viewport bottom, top corners only, drag handle) instead of a shrunk
   * centered dialog — the native mobile-app pattern, not a desktop dialog
   * scaled down. From `sm:` up it's a centered dialog as before. One
   * component, two layouts, picked purely by viewport width.
   */
  type Size = 'sm' | 'lg';

  interface Props {
    open: boolean;
    title: string;
    onclose: () => void;
    size?: Size;
    children: Snippet;
  }

  let { open, title, onclose, size = 'lg', children }: Props = $props();

  const widthMap: Record<Size, string> = {
    sm: 'max-w-md',
    lg: 'max-w-3xl'
  };

  // Only used to pick the transition's travel distance (sheet slides up from
  // off-screen; dialog just settles in slightly) — layout itself is pure
  // CSS/Tailwind breakpoints, this never gates markup or behavior.
  let isMobile = $state(false);

  $effect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => (isMobile = mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onclose();
  }

  // Swipe-to-dismiss on the sheet's drag handle (mobile only — the handle
  // itself is hidden from `sm:` up, so this never engages on the centered
  // dialog). Follows the pointer 1:1 while dragging, snaps back below a
  // distance/velocity threshold, closes past it — the standard bottom-sheet
  // gesture, not a custom invention.
  let dragY = $state(0);
  let dragging = $state(false);
  let dragStartY = 0;
  let dragStartTime = 0;

  function onDragStart(event: PointerEvent) {
    dragging = true;
    dragStartY = event.clientY;
    dragStartTime = event.timeStamp;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onDragMove(event: PointerEvent) {
    if (!dragging) return;
    dragY = Math.max(0, event.clientY - dragStartY);
  }

  function onDragEnd(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    const elapsed = Math.max(1, event.timeStamp - dragStartTime);
    const velocity = dragY / elapsed; // px/ms
    if (dragY > 120 || velocity > 0.5) {
      onclose();
    }
    dragY = 0;
  }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-deep/50 sm:items-center sm:p-4"
    role="presentation"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0"
      onclick={onclose}
      style={dragY ? `opacity: ${Math.max(0, 1 - dragY / 300)}` : undefined}
      transition:fade={{ duration: 150 }}
    ></div>
    <div
      class={cn(
        'relative flex max-h-[90dvh] w-full flex-col gap-3 rounded-t-3xl bg-cream p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl sm:max-h-[85vh] sm:rounded-2xl sm:p-4 sm:pb-4',
        widthMap[size]
      )}
      style="transform: translateY({dragY}px); transition: {dragging
        ? 'none'
        : 'transform 200ms ease'};"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      transition:fly={{ y: isMobile ? 400 : 24, duration: 200 }}
    >
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="-mx-3 -mt-3 flex shrink-0 touch-none justify-center py-3 sm:hidden"
        onpointerdown={onDragStart}
        onpointermove={onDragMove}
        onpointerup={onDragEnd}
        onpointercancel={onDragEnd}
      >
        <div class="h-1.5 w-10 rounded-full bg-deep/20"></div>
      </div>
      <div class="flex items-center justify-between gap-4">
        <h2 class="type-overline text-deep/70 truncate">{title}</h2>
        <button
          type="button"
          onclick={onclose}
          aria-label="Close"
          class="rounded-full px-3 py-1 text-deep/60 hover:bg-deep/10 hover:text-deep"
        >
          ✕
        </button>
      </div>
      <div class="min-h-0 overflow-auto rounded-xl bg-white/60">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
