<script lang="ts">
  import { cn } from '$lib/utils';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { toastIn, toastOut } from '$lib/motion';

  const toneClass: Record<'success' | 'error' | 'info', string> = {
    success: 'border-green/30 bg-green text-cream',
    error: 'border-green/30 bg-green text-cream',
    info: 'border-deep/20 bg-deep text-cream'
  };
</script>

<div
  class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8"
  aria-live="polite"
  role="status"
>
  {#each toastStore.items as item (item.id)}
    <div
      in:toastIn
      out:toastOut
      class={cn(
        'pointer-events-auto flex max-w-sm items-center gap-3 rounded-control border-2 px-5 py-3 text-[14px] font-semibold shadow-lg',
        toneClass[item.tone]
      )}
    >
      {item.message}
    </div>
  {/each}
</div>
