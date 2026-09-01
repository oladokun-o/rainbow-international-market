<script lang="ts">
  import { cn } from '$lib/utils';

  export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    /** Right-aligned upcharge, e.g. "+$2.00". */
    price?: string;
  }

  /** Mutually exclusive option list — pickup vs delivery, spice level, etc. */
  interface Props {
    label?: string;
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (_value: string) => void;
    disabled?: boolean;
    class?: string;
  }

  let {
    label,
    name,
    options,
    value = $bindable(''),
    onChange,
    disabled = false,
    class: className
  }: Props = $props();

  function pick(optionValue: string) {
    if (disabled) return;
    value = optionValue;
    onChange?.(optionValue);
  }
</script>

<fieldset class={cn('m-0 border-0 p-0', className)}>
  {#if label}
    <legend class="type-overline mb-2 p-0 text-deep/50">{label}</legend>
  {/if}
  <div class="flex flex-col">
    {#each options as option (option.value)}
      {@const on = option.value === value}
      <label
        class={cn(
          'flex items-start gap-3 border-t border-deep/10 py-2.5',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        <input
          type="radio"
          {name}
          value={option.value}
          checked={on}
          {disabled}
          onchange={() => pick(option.value)}
          class="sr-only"
        />
        <span
          aria-hidden="true"
          class={cn(
            'mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full border-2 bg-white/60 transition-colors duration-fast',
            on ? 'border-green' : 'border-deep/30'
          )}
        >
          {#if on}
            <span class="size-2.5 rounded-full bg-green"></span>
          {/if}
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="flex items-center justify-between gap-3">
            <span class="text-[14px] font-medium text-deep">{option.label}</span>
            {#if option.price}
              <span class="type-caption whitespace-nowrap text-deep/50">{option.price}</span>
            {/if}
          </span>
          {#if option.description}
            <span class="type-caption text-deep/50">{option.description}</span>
          {/if}
        </span>
      </label>
    {/each}
  </div>
</fieldset>
