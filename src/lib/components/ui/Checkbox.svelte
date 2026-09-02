<script lang="ts">
  import { cn } from '$lib/utils';
  import Icon from './Icon.svelte';

  /** Checkbox row. Used for order options and admin bulk selection. */
  interface Props {
    label: string;
    description?: string;
    checked?: boolean;
    onChange?: (_checked: boolean) => void;
    name?: string;
    value?: string;
    disabled?: boolean;
    /** Right-aligned upcharge, e.g. "+$1.50". */
    price?: string;
    class?: string;
  }

  let {
    label,
    description,
    checked = $bindable(false),
    onChange,
    name,
    value,
    disabled = false,
    price,
    class: className
  }: Props = $props();

  function handleChange(event: Event) {
    const next = (event.target as HTMLInputElement).checked;
    checked = next;
    onChange?.(next);
  }
</script>

<label
  class={cn(
    'flex items-start gap-3 py-2.5',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    className
  )}
>
  <input
    type="checkbox"
    {name}
    {value}
    {checked}
    {disabled}
    onchange={handleChange}
    class="sr-only"
  />
  <span
    aria-hidden="true"
    class={cn(
      'mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-control border-2 transition-colors duration-fast',
      checked ? 'border-green bg-green text-cream' : 'border-deep/30 bg-white/60'
    )}
  >
    {#if checked}
      <Icon name="check" size={13} strokeWidth={3} />
    {/if}
  </span>
  <span class="flex min-w-0 flex-1 flex-col gap-0.5">
    <span class="flex items-center justify-between gap-3">
      <span class="text-[14px] font-medium text-deep">{label}</span>
      {#if price}
        <span class="type-caption whitespace-nowrap text-deep/50">{price}</span>
      {/if}
    </span>
    {#if description}
      <span class="type-caption text-deep/50">{description}</span>
    {/if}
  </span>
</label>
