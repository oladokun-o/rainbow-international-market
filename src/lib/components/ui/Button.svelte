<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  /**
   * variant — primary (green filled, cream text) | secondary (deep outline)
   *           | ghost (text-only deep) | inverse (cream outline, for use on
   *           green/deep backgrounds — the other three all assume a
   *           cream/light background underneath)
   * size    — sm | lg
   */
  type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
  type Size = 'sm' | 'lg';

  interface Props {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    class?: string;
    onclick?: (_event: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'lg',
    disabled = false,
    loading = false,
    type = 'button',
    href,
    target,
    rel,
    class: className,
    onclick,
    children
  }: Props = $props();

  const sizeMap: Record<Size, string> = {
    lg: 'h-12 px-7 text-sm font-semibold rounded-control',
    sm: 'h-9 px-5 text-sm font-semibold rounded-control'
  };

  const styleMap: Record<Variant, string> = {
    primary: 'bg-orange text-white hover:brightness-95 active:brightness-90',
    secondary: 'bg-transparent border-2 border-green text-green hover:bg-green hover:text-cream',
    ghost: 'bg-transparent text-green hover:text-orange',
    inverse: 'bg-transparent border-2 border-cream text-cream hover:bg-cream hover:text-green'
  };

  const disabledMap: Record<Variant, string> = {
    primary: '!bg-orange/45 !text-white/80',
    secondary: 'opacity-40',
    ghost: 'opacity-40',
    inverse: 'opacity-40'
  };

  const classes = $derived(
    cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-normal select-none cursor-pointer active:scale-[0.98]',
      sizeMap[size],
      styleMap[variant],
      disabled && ['cursor-not-allowed active:scale-100', disabledMap[variant]],
      className
    )
  );
</script>

{#snippet inner()}
  {#if loading}
    <span
      class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
      aria-hidden="true"
    ></span>
  {/if}
  {@render children()}
{/snippet}

{#if href}
  <a
    {href}
    {target}
    {rel}
    class={classes}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : undefined}
  >
    {@render inner()}
  </a>
{:else}
  <button {type} {disabled} class={classes} {onclick}>
    {@render inner()}
  </button>
{/if}
