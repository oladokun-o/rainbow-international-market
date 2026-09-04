<script lang="ts">
  import { Check } from '@lucide/svelte';
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
        'pointer-events-auto flex max-w-sm items-start gap-3 rounded-control border-2 px-5 py-3 text-[14px] font-semibold shadow-lg',
        toneClass[item.tone]
      )}
    >
      {#if item.tone === 'success'}
        <span class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-orange text-cream">
          <Check size={12} strokeWidth={3} />
        </span>
      {/if}
      <div class="min-w-0">
        <p>{item.message}</p>
        {#if item.subtext}
          <p class="mt-0.5 text-[12px] font-normal text-cream/80">{item.subtext}</p>
        {/if}
        {#if item.action}
          <a
            href={item.action.href}
            class="mt-1 inline-block text-[13px] font-semibold underline underline-offset-2 hover:text-cream/80"
          >
            {item.action.label}
          </a>
        {/if}
      </div>
    </div>
  {/each}
</div>
